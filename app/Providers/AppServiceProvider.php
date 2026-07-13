<?php

namespace App\Providers;

use App\Models\Page;
use App\Models\PageSection;
use App\Models\Setting;
use App\Models\User;
use Database\Data\Sections\IntroSections;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('system_settings', function (): ?Setting {
            try {
                if (isDBConnected() && Schema::hasTable('settings')) {
                    return Setting::where('type', 'system')->first();
                }

                return null;
            } catch (\Throwable $th) {
                return null;
            }
        });

        $this->app->singleton('intro_page', function (): ?Page {
            try {
                if (isDBConnected() && Schema::hasTable('settings')) {
                    $home = Setting::where('type', 'home_page')->first();

                    $page = Page::where('id', $home->fields['page_id'])
                        ->with(['sections' => function ($query) {
                            $query->orderBy('sort', 'asc');
                        }])
                        ->first();

                    $this->ensureHome4Section($page, 'who_we_are', 'testimonials');
                    $this->ensureHome4Section($page, 'selected_courses', 'who_we_are');
                    $this->ensureHome4Section($page, 'why_choose_ebianch', 'selected_courses');

                    return $page;
                }

                return null;
            } catch (\Throwable $th) {
                return null;
            }
        });

        $this->app->singleton('catalog_page', function (): ?Page {
            try {
                if (!isDBConnected() || !Schema::hasTable('pages') || !Schema::hasTable('page_sections')) {
                    return null;
                }

                $page = Page::firstOrCreate(
                    ['slug' => 'courses-all'],
                    [
                        'name' => 'Course Catalog',
                        'title' => 'Course Catalog',
                        'description' => 'Browse the full course catalog.',
                        'meta_description' => 'Browse the full course catalog.',
                        'meta_keywords' => 'courses, catalog, online learning, aviation courses',
                    ]
                );

                $heroSection = PageSection::firstOrCreate(
                    [
                        'page_id' => $page->id,
                        'slug' => 'hero',
                    ],
                    [
                        'name' => 'Hero',
                        'title' => 'Sua carreira na aviação começa aqui',
                        'description' => 'Cursos online para quem quer evoluir na aviação com uma trilha objetiva, suporte especializado e conteúdo aplicado.',
                        'flags' => [
                            'title' => true,
                            'description' => true,
                        ],
                        'properties' => [
                            'button_text' => 'Pesquisar cursos',
                            'button_link' => '/courses/all',
                        ],
                        'active' => true,
                        'sort' => 1,
                    ]
                );

                if (!$page->relationLoaded('sections')) {
                    $page->load(['sections' => function ($query) {
                        $query->orderBy('sort', 'asc');
                    }]);
                }

                if ($page->sections->isEmpty() || $page->sections->doesntContain('id', $heroSection->id)) {
                    $page->load(['sections' => function ($query) {
                        $query->orderBy('sort', 'asc');
                    }]);
                }

                return $page;
            } catch (\Throwable $th) {
                return null;
            }
        });
    }

    private function ensureHome4Section(?Page $page, string $slug, ?string $afterSlug = null): void
    {
        if (!$page || $page->slug !== 'home-4') {
            return;
        }

        $existingSlugs = $page->sections->pluck('slug')->all();

        if (in_array($slug, $existingSlugs, true)) {
            return;
        }

        $sectionTemplate = collect(IntroSections::getHome4Sections())->firstWhere('slug', $slug);

        if (!$sectionTemplate) {
            return;
        }

        $afterSection = $afterSlug ? $page->sections->firstWhere('slug', $afterSlug) : null;
        $insertAfterSort = (int) ($afterSection?->sort ?? $page->sections->max('sort') ?? 0);

        PageSection::where('page_id', $page->id)
            ->where('sort', '>', $insertAfterSort)
            ->increment('sort');

        $section = new PageSection();
        $section->name = $sectionTemplate['name'];
        $section->slug = $sectionTemplate['slug'];
        $section->title = $sectionTemplate['title'] ?? null;
        $section->sub_title = $sectionTemplate['sub_title'] ?? null;
        $section->description = $sectionTemplate['description'] ?? null;
        $section->thumbnail = $sectionTemplate['thumbnail'] ?? null;
        $section->background_image = $sectionTemplate['background_image'] ?? null;
        $section->background_color = $sectionTemplate['background_color'] ?? null;
        $section->video_url = $sectionTemplate['video_url'] ?? null;
        $section->flags = $sectionTemplate['flags'] ?? [];
        $section->properties = $sectionTemplate['properties'] ?? [];
        $section->active = $sectionTemplate['active'] ?? true;
        $section->sort = $insertAfterSort + 1;
        $section->page_id = $page->id;
        $section->save();

        $page->load(['sections' => function ($query) {
            $query->orderBy('sort', 'asc');
        }]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return airways_frontend_url('/reset-password?token=' . $token . '&email=' . $user->email);
        });

        config([
            'app.url' => airways_app_url(),
            'app.asset_url' => airways_asset_url(),
            'app.frontend_url' => airways_frontend_url(),
        ]);

        // Trust proxies when running behind a reverse proxy (e.g., Docker, nginx)
        // This allows Laravel to correctly detect HTTPS when behind a proxy
        if (!app()->environment('local')) {
            request()->setTrustedProxies(
                ['*'],
                \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO |
                    \Illuminate\Http\Request::HEADER_X_FORWARDED_PREFIX
            );
        }

        // Force HTTPS scheme for URLs when accessed via HTTPS
        // This ensures assets load with the correct protocol
        if (airways_should_force_https()) {
            URL::forceScheme('https');
        }
    }
}
