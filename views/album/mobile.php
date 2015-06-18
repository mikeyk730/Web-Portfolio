<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

$this->title = $model->title;
?>

<div class="page-<?=$model->type?>"">
    <header>
	<div>
	    <a class="menu" href="#">Menu</a>
	    <h1>
		<?= Html::a('<span>{m.kaminski}</span>', ['album/home']);?>
	    </h1>
	</div>
            <?= $this->render('nav', 
                   ['user_id' => $model->user_id, 'album_id' => $model->id]); ?>

    </header>
    
    <section>
        <h2 class="page-title"><?= $model->title ?></h2>
        <div>
    	    <ul class="images">
                <?php 
                foreach($model->photos as $photo) {
                    if (!$photo->hide_on_mobile) {
                        $img = Html::img($photo->getUrl(400), ['data-src' => $photo->getUrl(800)]);
                        echo '<li>'.$img.'</li>';
                    }
                }
                ?>
	    </ul>
        </div>
    </section>

    <footer>
	<p class="copyright">&copy; 2015 Mike Kaminski</p>
    </footer>
</div>
