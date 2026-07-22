<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->string('subtitle')->nullable()->after('title');
            $table->foreignId('parent_id')
                ->nullable()
                ->after('navbar_id')
                ->constrained('navbar_items')
                ->cascadeOnDelete();
            $table->index(['navbar_id', 'parent_id', 'sort'], 'navbar_items_hierarchy_sort_index');
        });

        DB::transaction(function () {
            $dropdownItems = DB::table('navbar_items')
                ->where('type', 'dropdown')
                ->orderBy('sort')
                ->orderBy('id')
                ->get();

            foreach ($dropdownItems as $dropdownItem) {
                $children = json_decode($dropdownItem->items ?? '[]', true);
                $children = is_array($children) ? $children : [];

                DB::table('navbar_items')
                    ->where('id', $dropdownItem->id)
                    ->update([
                        'type' => 'url',
                        'items' => null,
                        'updated_at' => now(),
                    ]);

                foreach ($children as $index => $child) {
                    $title = $child['title'] ?? null;
                    $url = $child['url'] ?? $child['value'] ?? null;

                    if (!$title || !$url) {
                        continue;
                    }

                    DB::table('navbar_items')->insert([
                        'navbar_id' => $dropdownItem->navbar_id,
                        'parent_id' => $dropdownItem->id,
                        'sort' => $index + 1,
                        'type' => 'url',
                        'slug' => $child['slug'] ?? Str::slug(($dropdownItem->slug ?? 'navbar-item') . '-' . $title . '-' . ($index + 1)),
                        'title' => $title,
                        'subtitle' => $child['subtitle'] ?? null,
                        'value' => $url,
                        'items' => null,
                        'active' => array_key_exists('active', $child) ? (bool) $child['active'] : true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('navbar_items', function (Blueprint $table) {
            $table->dropIndex('navbar_items_hierarchy_sort_index');
            $table->dropConstrainedForeignId('parent_id');
            $table->dropColumn('subtitle');
        });
    }
};
