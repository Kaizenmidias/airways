<?php

return [
    'mode' => env('AIRWAYS_MODE', 'school'),
    'marketplace' => env('AIRWAYS_FEATURE_MARKETPLACE', false),
    'features' => [
        'instructors' => env('AIRWAYS_FEATURE_INSTRUCTORS', false),
        'jobs' => env('AIRWAYS_FEATURE_JOBS', false),
        'payouts' => env('AIRWAYS_FEATURE_PAYOUTS', false),
        'forum' => env('AIRWAYS_FEATURE_FORUM', false),
        'blog' => env('AIRWAYS_FEATURE_BLOG', true),
        'blog_social' => env('AIRWAYS_FEATURE_BLOG_SOCIAL', false),
        'newsletter' => env('AIRWAYS_FEATURE_NEWSLETTER', false),
    ],
];
