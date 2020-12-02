const createScheduler = require('./scheduler');

const QUEUES = 16;
const PRIORITIES = 16;
const TACTS = 20000;
const MINWEIGHT = 2;
const MAXWEIGHT = 64;

const waitingTimeByFrequency = () => {
  let csv = 'frequency,average_waiting_time\n';
  for (let frequency = 1; frequency < 100; frequency++) {
    const scheduler = createScheduler({
      minWeight: MINWEIGHT,
      maxWeight: MAXWEIGHT,
      maxPriority: PRIORITIES,
      frequency,
    }, QUEUES);

    scheduler.run(TACTS);

    const time = scheduler.tasks.reduce((prev, curr) => prev + curr.waitingTime, 0);
    const averageTime = time / scheduler.tasks.length;

    csv += `${frequency},${averageTime}\n`;
  }

  return csv;
};

const idleTimeByFrequency = () => {
  let csv = 'frequency,idle_time_part\n';
  for (let frequency = 1; frequency < 100; frequency++) {
    const scheduler = createScheduler({
      minWeight: MINWEIGHT,
      maxWeight: MAXWEIGHT,
      maxPriority: PRIORITIES,
      frequency,
    }, QUEUES);

    scheduler.run(TACTS);

    const idleTimePart = scheduler.idleTime / TACTS * 100;

    csv += `${frequency},${idleTimePart}\n`;
  }

  return csv;
};

const watingTimeByPriority = () => {
  let csv = 'priority,idle_time_part\n';
  const scheduler = createScheduler({
    minWeight: MINWEIGHT,
    maxWeight: MAXWEIGHT,
    maxPriority: PRIORITIES,
    frequency: 33,
  }, QUEUES);

  scheduler.run(TACTS);
  const tasks = scheduler.tasks;
  const priorities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const result = priorities.map(p => {
    const fitered = tasks.filter(task => task.priority === p)
    const sum     = fitered.reduce((prev, curr) => prev + curr.waitingTime, 0)
    const average = sum / fitered.length;
    return { p, time: average };
  });

  for (const record of result) {
    csv += `${record.p},${record.time}\n`
  }

  return csv;
};

console.log(waitingTimeByFrequency());
console.log(idleTimeByFrequency());
console.log(watingTimeByPriority());