# OS-lab3-scheduler

## Algorithm

We use foreground-background algorithm: there are N queues, new task come in first queue, task with maximal priority is chosen from queue with the smallest number, certain amount of processor time is given to this task, if they can't be finished in time they go into queue N+1, if task is in the last queue enogh time to finish is given.

## Grapghs

#### Average time of waiting by task frequency

![av-time](./img/av_time.png)

#### Part of idle time of waiting by task frequency

![idle](./img/idle.png)


#### Average time of waiting by task priority with fixed frequency

![by_priority](./img/by_priority.png)
