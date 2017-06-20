<?php
namespace app\assets;
use yii\web\AssetBundle;

class PostAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'main/album.css',
       'main/album-skin.css',
       'main/post-skin.css',
    ];
    public $js = [
       'main/jquery.1.10.1.min.js',
       'main/album.js',
       'main/post.js',
    ];
    public $depends = [
    ];
}
