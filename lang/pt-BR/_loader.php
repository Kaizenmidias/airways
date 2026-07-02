<?php

$group = basename(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1)[0]['file'], '.php');
$english = require dirname(__DIR__) . '/en/' . $group . '.php';
$overrides = require __DIR__ . '/_overrides.php';

return array_replace($english, $overrides[$group] ?? []);
