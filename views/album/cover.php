<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */
?>

<div id="billboard" class="slideshow">
    <?php 
    $i = array_rand($model->photos);
    $photo = $model->photos[$i];
    echo Html::img($photo->getUrl('1600'), ['class' => 'img']);
    ?>
</div>
