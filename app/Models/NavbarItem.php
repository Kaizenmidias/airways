<?php

namespace App\Models;

use App\Models\Course\CourseCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NavbarItem extends Model
{
    protected $fillable = [
        'sort',
        'type',
        'slug',
        'title',
        'subtitle',
        'value',
        'items',
        'course_category_id',
        'display_courses_in_menu',
        'active',
        'parent_id',
        'navbar_id',
    ];

    protected $casts = [
        'sort' => 'integer',
        'active' => 'boolean',
        'course_category_id' => 'integer',
        'display_courses_in_menu' => 'boolean',
        'parent_id' => 'integer',
        'items' => 'array',
    ];

    protected $attributes = [
        'items' => '[]',
    ];

    /**
     * Get the navbar this item belongs to
     */
    public function navbar(): BelongsTo
    {
        return $this->belongsTo(Navbar::class);
    }

    /**
     * Get the course category linked to this navbar item.
     */
    public function courseCategory(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'course_category_id');
    }

    /**
     * Get the parent item for nested navigation structures.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Get the child items for nested navigation structures.
     */
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort');
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($navbarItem) {
            if (is_null($navbarItem->sort)) {
                $navbarItem->sort = $navbarItem->getNextSortValue();
            }
        });
    }

    /**
     * Get the next sort value for this navbar item
     */
    protected function getNextSortValue(): int
    {
        $query = self::where('navbar_id', $this->navbar_id);

        if (!is_null($this->parent_id)) {
            $query->where('parent_id', $this->parent_id);
        } else {
            $query->whereNull('parent_id');
        }

        $maxSort = $query->max('sort');

        return $maxSort ? (int) $maxSort + 1 : 1;
    }
}
