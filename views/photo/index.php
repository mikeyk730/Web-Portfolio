<?php

use yii\helpers\Html;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel app\models\PhotoSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Photos';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="photo-index">

    <h1><?= Html::encode($this->title) ?></h1>
    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <p>
        <?= Html::a('Create Photo', ['create'], ['class' => 'btn btn-success']) ?>
    </p>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],
            'id',
            [
               'content' => function ($model, $key, $index, $column) {
                  return Html::img($model->getUrl(400), array("width"=>250));
               },
            ],
            'user_id',
            'album_id',
            'position',
            'filename',
            // 'width',
            // 'height',
            // 'aspect_ratio',
            // 'content_type',

            ['class' => 'yii\grid\ActionColumn'],
        ],
    ]); ?>

</div>
