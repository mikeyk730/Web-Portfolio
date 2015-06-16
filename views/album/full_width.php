<?php
use yii\helpers\Html;
/* @var $this yii\web\View */
/* @var $model app\models\Album */
?>
<div class="full-width grid native">
    <ul>
        <?php 
        $photo = $model->getRandomPhoto();
        $img = Html::img($photo->getUrl(1600), array(
            "data-dimensions" => $photo->width."x".$photo->height,
            "id" => $photo->filename,
        ));
        $a = Html::a($img, $photo->getUrl('1600'));
        $div = Html::tag('div',$a,array(
            'class'=>"photo",
            "data-aspect-ratio" => $photo->aspect_ratio,
            "data-original-width" => $photo->width,
            "data-original-height" => $photo->height,
        ));
        echo "<li>".$div."</li>";
        ?>
    </ul>
</div>
