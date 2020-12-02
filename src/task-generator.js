const Task = (weight, priority) => ({
  weight,
  priority,
  waitingTime: 0,
});

const generateInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const createGenerator = ({ minWeight, maxWeight, maxPriority, frequency }) => (tact) => {
  if (tact % frequency === 0) {
    return Task(generateInt(minWeight, maxWeight), generateInt(0, maxPriority));
  }
};

module.exports = createGenerator;