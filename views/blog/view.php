<?php
/* @var $this yii\web\View */
/* @var $model app\models\Post */
?>
<div id="post-container">
    <div id="post-cover">
        <?= $this->render('cover', ['model' => $model]);?>
    </div>
    <div id="content" class="thumbs">
        <?= $this->render($model->url_text, ['model' => $model]);?>
    </div>
</div>
