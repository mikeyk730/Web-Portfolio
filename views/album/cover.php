<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */
?>

<div id="billboard" class="slideshow">
    <?php 
    foreach($model->photos as $photo) {
        if (!$photo->hide_on_pc) {
            echo Html::img($photo->getUrl('1600'), ['class' => 'img']);
        }
    }
    ?>
</div>
