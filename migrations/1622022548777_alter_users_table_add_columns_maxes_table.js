const up =
    'ALTER TABLE users ' +
    'ADD attempts INTEGER DEFAULT 3 AFTER password, ' +
    'ADD attempts_at DATETIME NULL AFTER attempts;';

const down = 'ALTER TABLE users ' + 'DROP COLUMN attempts, ' + 'DROP COLUMN attempts_at;';

module.exports = {
    up,
    down,
};
