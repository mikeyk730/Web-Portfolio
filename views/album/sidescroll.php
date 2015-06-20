<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>

<div class="sidescroll native">
    <ul class="images">
        <?php
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_pc) {
                $img = Html::img($photo->getUrl('1600'), array(
                    "data-dimensions" => $photo->width."x".$photo->height,
                    "id" => $photo->filename,
                ));
                $div = "";
                if ($photo->title || $photo->description)
                    $div = '<div><h4>'.$photo->title.'</h4><div class="description">'.$photo->description.'</div></div>';
                echo '<li>'.$img.$div.'</li>';
            }
        }
        ?>
    </ul>
</div>
