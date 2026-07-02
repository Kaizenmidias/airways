<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (!DB::getSchemaBuilder()->hasTable('languages') || !DB::getSchemaBuilder()->hasTable('language_properties')) {
            return;
        }

        DB::table('languages')->update(['is_default' => false]);

        $language = DB::table('languages')->where('code', 'pt-BR')->first();
        $values = [
            'name' => 'Portuguese (Brazil)',
            'nativeName' => 'Português (Brasil)',
            'is_active' => true,
            'is_default' => true,
            'updated_at' => now(),
        ];

        if ($language) {
            DB::table('languages')->where('id', $language->id)->update($values);
            $languageId = $language->id;
        } else {
            $languageId = DB::table('languages')->insertGetId([
                ...$values,
                'code' => 'pt-BR',
                'created_at' => now(),
            ]);
        }

        foreach (['auth', 'button', 'common', 'dashboard', 'frontend', 'input', 'settings', 'table'] as $group) {
            $translations = require lang_path("pt-BR/{$group}.php");
            $definitions = require storage_path("app/lang/groups/{$group}.php");

            foreach ($definitions as $definition) {
                $properties = [];
                foreach (array_keys($definition['properties']) as $key) {
                    $properties[$key] = $translations[$key] ?? $definition['properties'][$key];
                }

                DB::table('language_properties')->updateOrInsert(
                    ['language_id' => $languageId, 'group' => $group, 'slug' => $definition['slug']],
                    [
                        'name' => $definition['name'],
                        'properties' => json_encode($properties, JSON_UNESCAPED_UNICODE),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }

        Cache::forget('language_properties:pt-BR');
        Cache::forget('language_properties:en');
    }

    public function down(): void
    {
        $languageId = DB::table('languages')->where('code', 'pt-BR')->value('id');
        if ($languageId) {
            DB::table('language_properties')->where('language_id', $languageId)->delete();
            DB::table('languages')->where('id', $languageId)->delete();
            DB::table('languages')->where('code', 'en')->update(['is_default' => true]);
        }
    }
};
