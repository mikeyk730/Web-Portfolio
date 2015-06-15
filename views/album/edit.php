<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;


/* @var $this yii\web\View */
/* @var $model app\models\Album */

$this->title = $model->title;
?>
<div class="album-edit">

    <h1><?= Html::a($this->title, ['album/view', 'id'=>$model->id]) ?></h1>

    <?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]); ?>
    <?= $form->field($model, 'file[]')->label('Add photos')->fileInput(['multiple' => true]) ?>
    <?php ActiveForm::end(); ?>
    
    <?php
    echo '<ul class="grid" id="sortable" data-reorder-url="'.Yii::$app->urlManager->createUrl(['album/reorder', 'id'=>$model->id]).'" data-edit-url="'.Yii::$app->urlManager->createUrl(['photo/update']).'" data-delete-url="'.Yii::$app->urlManager->createUrl('photo/delete').'">';
    foreach($model->photos as $photo) {
        $options = array("id" => $photo->id);
        $hidden = $photo->hide_on_pc || $photo->hide_on_mobile;
        if ($hidden) {
            $options['class'] = "hidden";
        }
        $img = Html::img($photo->getUrl(400));
        $content = '<div class="thumb-container image"><div class="thumb">'.$img.'<a href="#" class="action remove"></a><a href="#" class="action hide"></a><a href="#" class="action details"></a><a href="#" class="action sort"></a></div>';
        echo Html::tag('li', $content, $options);
    } 
    echo '</ul>';
    ?> 

</div>
