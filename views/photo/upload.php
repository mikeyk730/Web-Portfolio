<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;    

/* @var $this yii\web\View */
/* @var $model app\models\Photo */

$this->title = 'Upload Photo';
$this->params['breadcrumbs'][] = ['label' => 'Photos', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="photo-create">

<?php $form = ActiveForm::begin(['options' => ['enctype' => 'multipart/form-data']]);?>


<div class="row">
   <?php echo $form->field($model, 'image')->fileInput(); ?> 
   </div>
   <?php if($model->isNewRecord!='1'){ ?>
    <div class="row">
      <?php echo Html::img(Url::home(true).'/banner/'.$model->image,array("width"=>200)); ?> 
    </div>
   <?php } ?>

   <?= $form->field($model, 'album_id')->textInput() ?>
   <?= $form->field($model, 'position')->textInput() ?>
        
    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>
                               
 <?php ActiveForm::end(); ?>

</div>
