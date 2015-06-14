<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>

<div class="sidescroll native">
    <ul class="images">
        <?php
        foreach($model->photos as $photo) {
            $img = Html::img($photo->getUrl('1600'), array(
                "data-dimensions" => $photo->width."x".$photo->height,
                "id" => $photo->filename,
            ));
            echo '<li>'.$img.'</li>';
        } 
        ?>
    </ul>
</div>
