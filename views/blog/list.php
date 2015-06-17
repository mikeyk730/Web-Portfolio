<?php
use yii\helpers\Html;
$posts = app\models\Post::getPosts($user_id);
?>
<div id="main-wrapper">   
    <div id="profile">
        <div id="posts-grid">
            <div class="squares">
                <?php  
                $first = true;
                foreach($posts as $post){
                    $class = "post-square";
                    if ($first){
                        $class = $class." featured-post";
                    }?>
                <div class="<?=$class?>">
	            <div class="post-meta">
	    	        <div class="post-titles">
                            <h1><?= Html::a($post->title, array('blog/view', 'id'=>$post->id)); ?></h1>
                            <h2><?= Html::a($post->subtitle, array('blog/view', 'id'=>$post->id)); ?></h2>
                        </div>
                        <div class="post-date posted-by">
                            <?php $datetime = new DateTime($post->date);
                            echo $datetime->format('F j<\s\up>S</\s\up>, Y'); ?>
                        </div>
                    </div>
                    <div class="post-image" style="background-image:url(<?= $post->getCoverUrl(false, $first ? 800 : 400) ?>)"></div>
                </div>
                <?php
                $first = false;
                }
                ?>
            </div>
        </div>
    </div>
</div>
