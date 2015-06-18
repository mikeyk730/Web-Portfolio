<?php
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Post */
?>
<header>
    <div id="cover-image" class="animated delay-1s fadeIn" style="background-image:url(<?php echo $model->getCoverUrl() ?>)">
        <div class="post-titles">
            <h1 class="tour-tip"><?php echo $model->title ?></h1>
            <h2><?php echo $model->subtitle ?></h2>
        </div>
        <div class="author-meta">
            <span class="author-avatar"><?php $img = Html::img($model->user->getAvatarUrl());
                                        echo Html::a($img, array('blog/index'/*, 'user_id'=>$model->user->id*/));?></span>
            <div class="author-detail">
	        <span class="name">Post by <span class="username"><?= Html::a($model->user->username, array('blog/index'/*, 'user_id'=>$model->user->id()*/)); ?></span></span>
                <span class="post-date"><?php $datetime = new DateTime($model->date);
                                        echo $datetime->format('F j<\s\up>S</\s\up>, Y'); ?></span>
            </div>
        </div>
    </div>
</header>

