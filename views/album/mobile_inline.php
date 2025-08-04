<?php
use yii\helpers\Html;
/* @var $this yii\web\View */
/* @var $model app\models\Album */
?>
<div class="inline-album">
    <ul class="images">
        <?php 
        foreach($model->photos as $photo) {
            if (!$photo->hide_on_mobile) {
                $img = Html::img($photo->getUrl(800), ['class'=>'img']);
                echo "<li>".$img."</li>";
            } 
        }
        ?>
    </ul>
</div>
