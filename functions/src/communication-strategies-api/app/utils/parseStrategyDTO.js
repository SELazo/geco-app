const parseStrategyDTO = (strategy, ads, groups) => ({
    ...parseStrategy(strategy),
    ads,
    groups
})

const parseStrategy = (strategy) => Object.keys(strategy).reduce((acc, key) => {
    const newKey = key.replace("strategy_", "").replace("accounts_", "");
    acc[newKey] = strategy[key];
    return acc;
}, {});

module.exports = parseStrategyDTO;