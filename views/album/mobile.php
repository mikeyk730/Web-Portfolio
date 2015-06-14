<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\Album */

?>

<body>
    <header>
	<div>
	    <a class="menu" href="#">Menu</a>
	    <h1>
		<?= Html::a('<span>{mk} Exposed</span>', ['site/index']);?>
	    </h1>
	</div>
            <?= $this->render('nav', 
                   ['user_id' => $model->user_id, 'album_id' => $model->id]); ?>

    </header>
    
    <section>
        <h2><?= $model->title ?></h2>
        <div>
    	    <ul class="images">
                <?php 
                foreach($model->photos as $photo) {
                    $img = Html::img($photo->getUrl(400));
                    echo '<li>'.$img.'</li>';
                }
                ?>
	    </ul>
        </div>
    </section>

    <footer>
	<p class="copyright">&copy; 2015 Mike Kaminski</p>
    </footer>
</body>
