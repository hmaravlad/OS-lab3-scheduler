const createTaskGenerator = require('./task-generator');

const QueueCollection = (queuesNumber) => ({
  queues: Array(queuesNumber).fill([]),
  pushTask(task) {
    this.queues[0].push(task);
  },

  getTask() {
    let i = this.queues.findIndex(queue => queue.length > 0);
    if (i === -1) return null;
    const queue = this.queues[i];
    const task = queue.reduce((prev, curr) => prev.priority > curr.priority ? prev : curr);
    this.queues[i] = queue.filter(t => t !== task);

    return {
      task,
      quantum: i === this.queues.lenght - 1 ? task.weight : 2 * i + 1,
    };
  },
});

const Scheduler = (taskParams, queuesNumber) => ({
  genTask: createTaskGenerator(taskParams),
  queueCollection: QueueCollection(queuesNumber),
  tasks: [],

  tact: 0,
  currTask: null,

  idleTime: 0,
  
  nextTact() {
    this.tact += 1;

    //console.dir({ task: this.currTask });

    const newTask = this.genTask(this.tact);
    if (newTask) {
      this.queueCollection.pushTask(newTask);
      this.tasks.push(newTask);
    }

    if (this.currTask?.task?.weight === 0) {
      this.currTask.task.finished = true;
    }

    if (!this.currTask || this.currTask.quantum === 0) {
      if (this.currTask?.task?.weight > 0) {
        this.queueCollection.pushTask(this.currTask.task);
      }
      this.currTask = this.queueCollection.getTask();
    }

    if (this.currTask) {
      this.currTask.quantum -= 1;
      this.currTask.task.weight -= 1;
    }

    for (const task of this.tasks) {
      if (!task.finished) task.waitingTime += 1;
    }

    if (!this.currTask) {
      this.idleTime += 1;
    }
  },

  run(tacts) {
    for (let i = 0; i < tacts; i++) {
      this.nextTact();
    }
  },

  runVisual(tacts) {
    for (let i = 0; i < tacts; i++) {
      console.log(`${this.tact}\t| ${this.currTask ? this.currTask.task.weight : 'idle'}`);
      this.nextTact();
    }
  }
});

module.exports = Scheduler;