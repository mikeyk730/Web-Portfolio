<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>
<div class="square-tiles">
<div class="grid native">
    <ul class="thumbs">
        <?php 
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_pc) {
                $img = Html::img($photo->getUrl(400), array(
                    "data-dimensions" => $photo->width."x".$photo->height,
                    "id" => $photo->filename,
                    "alt" => $photo->title,
                ));
                $div = "";
                if ($photo->title || $photo->description)
                    $div = '<div><h4>'.$photo->title.'</h4><div class="description">'.$photo->description.'</div></div>';
                $a = Html::a($img.$div, $photo->getUrl('1600'));
                echo '<li>'.$a.'</li>';
            } 
        }
        ?>
    </ul>
</div>
</div>
