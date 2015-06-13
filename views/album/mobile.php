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
		<a href="/m/">
		    <span>Exposed</span>
		</a>
	    </h1>
	</div>
	<nav>
	    <ul>
		<li><a href="/m/places">Places</a></li>
		<li><a href="/m/people">People</a></li>
		<li><a href="/m/wildlife">Wildlife</a></li>
		<li class="accordion">
		    <a href="#">Galleries</a>
		    <ul>
			<li><a href="/m/time-travel">Time Travel</a></li>
		    </ul>
		</li>
	    </ul>
	</nav>
    </header>
    
    <section>
        <h2>Places</h2>
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
	<a id="fullsite" href="/actions/fullsite">View Full Site</a>
    </footer>
</body>
