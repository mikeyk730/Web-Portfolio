<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;


/* @var $this yii\web\View */
/* @var $model app\models\Album */

$this->title = $model->title;
?>
<div class="album-edit">

    <h1><?= Html::encode($this->title) ?></h1>

    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
    <?= $form->field($model, 'file[]')->fileInput(['multiple' => true]) ?>
    <?php ActiveForm::end(); ?>
    
    <?php
    echo '<ul id="sortable" data-reorder-url="'.Yii::$app->urlManager->createUrl(['album/reorder', 'id'=>$model->id]).'">';
    foreach($model->photos as $photo) {
        $img = Html::img($photo->getUrl(400));
        echo Html::tag('li', $img, array("id"=>$photo->id));
    } 
    echo '</ul>';
    ?> 

</div>
