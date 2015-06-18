<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>

<div class="carousel native">
    <ul class="thumbs">
        <?php 
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_pc) {
                $img = Html::img($photo->getUrl(400), array(
                    "data-dimensions" => $photo->width."x".$photo->height,
                    "id" => "thumb-".$photo->id,
                ));
                $a = Html::a($img, $photo->getUrl('1600'));
                echo '<li>'.$a.'</li>';
            } 
        }
        ?>
    </ul>
    <ul class="images">
        <?php 
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_pc) {
                $img = Html::img($photo->getUrl(1600), array(
                    "data-dimensions" => $photo->width."x".$photo->height,
                    "id" => "image-".$photo->id,
                ));
                echo '<li>'.$img.'</li>';
            } 
        }
        ?>
    </ul>
</div>
