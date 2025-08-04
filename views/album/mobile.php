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
		<?= Html::a('<span>{one.more.country}</span>', ['album/home']);?>
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
                        $img = Html::img($photo->getUrl(800), ['data-src' => $photo->getUrl(800)]);
                        $div = "";
                        if ($photo->title || $photo->description)
                            $div = '<div><h4>'.$photo->title.'</h4><div class="description"><p>'.$photo->description.'</p></div></div>';
                        echo '<li>'.$img.$div.'</li>';
                    }
                }

                if (strcmp('custom', $model->type) == 0){
                    echo $this->render($model->url_text, ['model' => $model]);
                }
                ?>
	    </ul>
        </div>
    </section>

    <footer>
	<p class="copyright">&copy; 2015 Mike Kaminski</p>
    </footer>
</div>
