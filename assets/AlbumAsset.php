<?php
namespace app\assets;
use yii\web\AssetBundle;

class AlbumAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
       'main/album.css',
       'main/album-skin.css',
    ];
    public $js = [
       'main/jquery.1.10.1.min.js',
       'main/album.js',
    ];
    public $depends = [
    ];
}
