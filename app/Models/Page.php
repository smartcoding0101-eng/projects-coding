<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'content' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];
}
