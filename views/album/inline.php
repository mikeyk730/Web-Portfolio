<?php
use yii\helpers\Html;
/* @var $this yii\web\View */
/* @var $model app\models\Album */
$is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;
?>
<div class="inline-album grid native">
    <ul>
        <?php 
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_pc) {
                $img = Html::img($photo->getUrl(800), array(
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
            } 
        }
        ?>
    </ul>
</div>
