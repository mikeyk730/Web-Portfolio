<?php
use yii\helpers\Html;
$is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;
$branding = $is_mobile ? '{m.kaminski}' : '{mk}';
?>
<div class="left">  
    <header>
	<div>
	    <a class="menu" href="#">Menu</a>
	    <h1>
                <?= Html::a('<span>'.$branding.'</span>', ['/album/home']); ?>
	    </h1>
        </div>
            <?= $this->render('//album/nav', 
                   ['user_id' => $user_id, 'album_id' => 'blog']); ?>
        </header> 
    <div id="content">
        <h2 class="page-title">Blog</h2>
        <div id="posts-grid">
            <div class="squares">
                <?php  
                $first = true;
                foreach($posts as $post){
                    $class = "post-square";
                    if ($first){
                        $class = $class." featured-post";
                    }?>
                <div class="<?=$class?>" style="background-image:url(<?= $post->getCoverUrl(false, $first ? 800 : 400) ?>)"">
	            <div class="post-meta">
	    	        <div class="post-titles">
                            <h1><?= Html::a($post->title, array('blog/view', 'url_text'=>$post->url_text)); ?></h1>
                            <h2><?= Html::a($post->subtitle, array('blog/view', 'url_text'=>$post->url_text)); ?></h2>
                        </div>
                        <div class="post-date posted-by">
                            <?php $datetime = new DateTime($post->date);
                            echo $datetime->format('F j<\s\up>S</\s\up>, Y'); ?>
                        </div>
                    </div>
                </div>
                <?php
                $first = false;
                }
                ?>
            </div>
        </div>
    </div>
</div>
