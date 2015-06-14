<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

$bleed = (strcmp($model->type,'cover') == 0) ? 'bleed' : 'nobleed';
$this->title = $model->title;
?>
<div class="left <?=$bleed?>" id ="<?=$model->url_text?>">
    <div id="layout">
        <header>
	    <h1>
                <?= Html::a('<span>{mk}</span>', ['/album/home']); ?>
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
