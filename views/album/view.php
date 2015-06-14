<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

$bleed = (strcmp($model->type,'cover') == 0) ? 'bleed' : 'nobleed';
$branding = (strcmp($model->type,'cover') == 0) ? '{m.kaminski}' : '{mk}';
$this->title = $model->title;
?>
<div class="left <?=$bleed?> page-<?= $model->type?>" id="container">
    <div id="layout">
        <header>
	    <h1>
                <?= Html::a('<span>'.$branding.'</span>', ['/album/home']); ?>
	    </h1>
            <?= $this->render('nav', 
                   ['user_id' => $model->user_id, 'album_id' => $model->id]); ?>
        </header>
        <div id="content">
            <?= $this->render($model->type, ['model' => $model]); ?> 
        </div>
        <footer>
            <p class="copyright">&copy; Mike Kaminski</p>
        </footer>
    </div>
</div>
