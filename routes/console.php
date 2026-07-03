<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('airways:normalize-internal-urls {--apply : Persist the changes instead of running in dry-run mode}', function () {
    $old = 'http://airwaysacademy.com.br';
    $new = 'https://airwaysacademy.com.br';
    $apply = (bool) $this->option('apply');

    $tables = [
        'settings' => [
            'fields' => 'json',
        ],
        'pages' => [
            'banner' => 'string',
            'favicon' => 'string',
            'description' => 'text',
            'meta_description' => 'text',
            'meta_keywords' => 'string',
        ],
        'page_sections' => [
            'thumbnail' => 'string',
            'background_image' => 'string',
            'video_url' => 'string',
            'description' => 'text',
            'flags' => 'json',
            'properties' => 'json',
        ],
        'media' => [
            'custom_properties' => 'json',
            'responsive_images' => 'json',
            'manipulations' => 'json',
            'generated_conversions' => 'json',
        ],
        'chunked_uploads' => [
            'file_url' => 'string',
            'metadata' => 'json',
        ],
        'navbar_items' => [
            'value' => 'string',
            'items' => 'json',
        ],
        'footer_items' => [
            'items' => 'json',
        ],
        'blogs' => [
            'thumbnail' => 'string',
            'banner' => 'string',
            'description' => 'text',
            'meta_description' => 'text',
            'meta_keywords' => 'string',
        ],
    ];

    $replaceRecursive = function ($value) use (&$replaceRecursive, $old, $new, &$replacements): mixed {
        if (is_array($value)) {
            foreach ($value as $key => $item) {
                $value[$key] = $replaceRecursive($item);
            }

            return $value;
        }

        if (is_string($value) && str_contains($value, $old)) {
            $count = 0;
            $value = str_replace($old, $new, $value, $count);
            $replacements += $count;
        }

        return $value;
    };

    $totalRows = 0;
    $totalChanges = 0;
    $replacements = 0;

    foreach ($tables as $table => $columns) {
        if (!Schema::hasTable($table)) {
            $this->line("Skipping {$table}: table not found.");
            continue;
        }

        $tableRows = 0;
        $tableChanges = 0;

        DB::table($table)
            ->orderBy('id')
            ->chunkById(100, function ($rows) use ($table, $columns, $old, $new, $apply, &$tableRows, &$tableChanges, &$replacements, $replaceRecursive) {
                foreach ($rows as $row) {
                    $tableRows++;
                    $updates = [];

                    foreach ($columns as $column => $type) {
                        if (!property_exists($row, $column) || $row->{$column} === null) {
                            continue;
                        }

                        $current = $row->{$column};
                        $updated = $current;

                        if ($type === 'json') {
                            $decoded = is_string($current) ? json_decode($current, true) : $current;

                            if (json_last_error() === JSON_ERROR_NONE) {
                                $updated = $replaceRecursive($decoded);
                                $updated = json_encode($updated, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                            } elseif (is_string($current) && str_contains($current, $old)) {
                                $count = 0;
                                $updated = str_replace($old, $new, $current, $count);
                                $replacements += $count;
                            }
                        } elseif (is_string($current) && str_contains($current, $old)) {
                            $count = 0;
                            $updated = str_replace($old, $new, $current, $count);
                            $replacements += $count;
                        }

                        if ($updated !== $current && $updated !== null) {
                            $updates[$column] = $updated;
                        }
                    }

                    if ($updates !== []) {
                        $tableChanges++;
                        $totalChanges++;

                        if ($apply) {
                            DB::table($table)->where('id', $row->id)->update($updates);
                        }
                    }
                }
            });

        $totalRows += $tableRows;
        $this->line(sprintf('%s: %d row(s) scanned, %d row(s) need update%s.', $table, $tableRows, $tableChanges, $apply ? ' and were updated' : ''));
    }

    $this->newLine();
    $this->info(sprintf(
        '%s complete. %d row(s) scanned, %d row(s) changed, %d replacement(s) found.',
        $apply ? 'Apply' : 'Dry run',
        $totalRows,
        $totalChanges,
        $replacements
    ));

    if (!$apply) {
        $this->warn('Run again with --apply to persist the replacements.');
    }
})->purpose('Normalize internal Airways Academy URLs to HTTPS');
