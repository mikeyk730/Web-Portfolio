<?php
return [
    'createAlbum' => [
        'type' => 2,
        'description' => 'Create albums',
    ],
    'author' => [
        'type' => 1,
        'children' => [
            'createAlbum',
            'modifyOwnAlbum',
        ],
    ],
    'modifyOwnAlbum' => [
        'type' => 2,
        'description' => 'Modify own album',
        'ruleName' => 'isAuthor',
        'children' => [
            'modifyAlbum',
        ],
    ],
    'modifyAlbum' => [
        'type' => 2,
        'description' => 'Modify albums',
    ],
];
