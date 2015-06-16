<?php
use yii\helpers\Html;
/* @var $this yii\web\View */
/* @var $model app\models\Album */
?>
<div class="full-width">
    <ul class="images">
        <?php 
        $photo = $model->getRandomPhoto(true);
        $img = Html::img($photo->getUrl(800), ['class'=>'img']);
        echo "<li>".$img."</li>";
        ?>
    </ul>
</div>
