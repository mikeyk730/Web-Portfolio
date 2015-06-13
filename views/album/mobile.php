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
	<nav>
	    <ul>
		<li><?= Html::a('Places', ['album/view', 'url_text' => 'places']);?></li>
		<li><?= Html::a('People', ['album/view', 'url_text' => 'people']);?></li>
		<li><?= Html::a('Wildlife', ['album/view', 'url_text' => 'wildlife']);?></li>
		<li class="accordion">
		    <a href="#">Galleries</a>
		    <ul>
			<li><?= Html::a('Time Travel', ['album/view', 'url_text' => 'time-travel']);?></li>
		    </ul>
		</li>
	    </ul>
	</nav>
    </header>
    
    <section>
        <h2><?= $model->title ?></h2>
        <div>
    	    <ul class="images">
                <?php 
                foreach($model->photos as $photo) {
                    $img = Html::img($photo->getUrl(400));
                    echo '<li>'.$img.'<div><h4></h4><p class="description"></p></div></li>';
                }
                ?>
	    </ul>
        </div>
    </section>

    <footer>
	<p class="copyright">&copy; 2015</p>
    </footer>
</body>
