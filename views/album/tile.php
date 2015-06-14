<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>

<div class="tile native">
    <ul class="thumbs">
        <?php 
        foreach($model->photos as $photo) {
            $img = Html::img($photo->getUrl(400), array(
                "data-dimensions" => $photo->width."x".$photo->height,
                "id" => $photo->filename,
            ));
            $a = Html::a($img, $photo->getUrl('1600'));
            echo '<li>'.$a.'</li>';
        } 
        ?>
    </ul>
</div>
