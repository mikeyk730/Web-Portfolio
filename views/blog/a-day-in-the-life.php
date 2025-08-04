<?php
use yii\helpers\Html;
function addAlbum($thiss, $model, $type, $id)
{
    $is_mobile = \Yii::$app->devicedetect->isMobile() && !\Yii::$app->devicedetect->isTablet();;
    if ($is_mobile){
        $type = "mobile_".$type;
    }
    $view = "//album/".$type;
    return $thiss->render($view, ['model' => $model->getAlbum($id)]);
}

$this->title = $model->title;
?>
<div class="text-section">
    <h1><?=$model->title?></h1>
    <h2><?=$model->subtitle?></h2>

    <p>The sun has yet to rise.  I'm sitting on the back of a motorbike, dodging heaping piles of elephant dung that litter the morning streets.  I'm on my way to Kibale Forest where myself and three others will be spending the day tracking chimpanzees.  Finding their nests soon after sunrise, we will follow them until they nest again in the evening.  A day in the life of Jane Goodall, the Chimpanzee Habituation Experience.</p>
    <p>The day starts off with a surprise.  The forest is filled with frantic, high-pitched calls of alarmed chimpanzees.  Our guide slows to a crawl and holds his rifle close.  Before us, partially hidden in the trees, stands a giant. A forest elephant.  Unlike their Savannah relatives, forest elephants are solitary, aggressive, and very suspicious to any change in their environment - a group of people, for example.  Towering over 10 feet tall and separated from us by only a handful of trees, the feelings of excitement, wonder, intimidation, and fear all swirl together.  As much as his majesty deserves to be appreciated, we cautiously creep back and make an escape.  The chimp cries carry on.</p>
    <p>No sooner have we retreated into the forest when we cross paths with three male chimps on the move.  They quickly scramble along the forest floor, and we start our pursuit of the leader.  He will be our chimp for the day – we will follow shortly behind as long as we can keep up.  Since chimps specialize in moving through the trees, it's surprising how adept they are on the ground.  Fortunately for us lowly humans, they choose the path of least resistance.  This allows us to just keep up, and only occasionally do we have to struggle through thick brush.  The three chimps soon decide they have reached their destination.  Here they reveal their true skill.  In a matter of seconds they are 20 meters overhead in a tree.  When one reclines on a branch, another carefully starts grooming him.  High above in the forest canopy, he pores through the fur of his companion.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'inline', 12); ?>
</div>
<div class="text-section">
    <p>Grooming is an important behavior in chimpanzee society.  On the surface it's a hygienic act (to clean away dirt and remove parasites), but there's a secondary function.  Like humans, chimps are highly social.  It's social interaction that enables chimps to have strong family bonds and maintain dominance hierarchies.  Grooming is one of many activities used to establish trust and strengthen friendships.</p>
    <p>Just when it seems they will pass the entire day lazing about, they are on the move again.  Ambling down the trunk, they're quickly back on the ground.  I'm focused on taking photos, so I don't immediately realize why my camera is unable to focus.  When I pull the camera from my eye, it's obvious.  They are too close.  The line that the trio takes is no more than a meter from my leg.  Their proximity makes me tense, yet they pay us no attention at all.</p>
    <p>When a far away call disturbs one of them, he peers around me as if I were a tree, just another inanimate object that happens to be blocking his view.  A chimpanzee's normal response to a human is to flee – after all we are their biggest threat. So why do these chimps act so strangely? Most primate encounters in Africa rely on habituation. A process where animals are exposed to human contact over prolonged periods of time – often 5+ years! Rangers or researchers may visit a specific group of chimpanzees at their nesting sites every morning for several hours. Over the course years, humans become accepted as part of the normal environment, a non-threat that can be ignored.
    <p>Jane Goodall used the reward of bananas to attract chimps to her camp. It was only through bribery that chimps started to tolerate researchers.  Today's scientists would scoff at this approach, and the rangers of Kibale have resorted to no such tricks.  Here they've relied on the more patient approach of just being present.  Since 1991 tourists have been enjoying the rewards of their labors.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'inline', 17); ?>
</div>
<div class="text-section">
    <p>Chimp calls bring the forest alive.  The three solitary animals join and are joined by countless more.  It's suddenly very social: feeding time.  I count over a dozen individuals moving about in the branches of the fig tree that towers overhead.  They stuff their faces, flashing grins that reveal a mouthful of figs.  A baby ventures away from his mother swinging from a limb.  He's soon joined by another youngster, and they tumble about and start to play.  Watching them swing at each other, legs kicking about, I'm taken back to my playground days on the monkey bars.</p>
    <p>The feeding frenzy lasts for a long time.  A large group of tourists shows up, unlike us they'll only get to see the animals for an hour.  When they move on, we linger, take our time, and observe.  The group of chimps starts to thin out as those that have had their fill move on.  Our males hang back with a small group. Finding a shady part of the forest, they rest.  Some individuals start grooming, while others let out yawns that reveal intimidating incisors.  Our male finds some privacy and lounges back, laying on one arm.  He pays us no attention when we approach and drifts off to sleep.  We take the opportunity to snack and have a little rest ourselves.  We've been in the forest for five hours already, but we're only getting started.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'inline', 13); ?>
</div>
<div class="text-section">
    <p>On the move again, I begin to appreciate the range of behaviors chimps show in a single day.  A baby clinging to her mother's back is beautiful, but it's impossible to get close.  Males guard her path on either side as she travels.  Only after she has moved significantly forward do they abandon their sentinel posts and rejoin the moving group.  It doesn't take long to learn some social cues.  Often a male would stop in his tracks and be absolutely still.  I am quick to learn that this is a sign for what is to occur.</p>
    <p>Chimpanzee society is shaped by a social hierarchy.  At any one time, an individual knows who he can dominate and who he must submit to.  This chimp has a point to prove.  In an instant his stillness is shattered.  Reaching onto the nearest branch, he tears it from the tree.  He starts making aggressive hoots, before he takes off in a sprint.  Charging through the forest, he swings his branch, and drums on the tree buttresses with his feet.  For a minute or two, it's commotion.  Others hurry out of his path and up into the trees.  His display of aggression cannot go unnoticed by anybody or anything in the vicinity.</p>
    <p>A display from an individual is intimidating, but a encounter with a rival group is frightening.  A silent forest suddenly erupts into a deafening frenzy.  Alarm calls from the entire group sound through the trees.  Similar calls are reciprocated from deeper in the forest.  Suddenly everyone is scrambling up trees, shaking branches, and screaming.  There's a competing group in the area, and each group wants to frighten the other away.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'inline', 16); ?>
</div>
<div class="text-section">
    <p>These tense warnings to rival groups repeat throughout the day, and there's a good reason for the hysteria.  Allied chimps form communities to control large territories.  Outsiders are met with aggression.  If competition for mates and resources becomes too great, rival communities can erupt in battle.  These conflicts are often bloody and sometimes end in death.  It's no wonder they try intimidation before things have a chance to escalate.</p>
    <p>Ten hours after we've begun, the male we've been with has slipped out of sight.  We decide to take a break for lunch.  But not before we find another dozen chimps in the vicinity.  I down my food as quickly as possible, because the excitement hasn't diminished in the least since morning.  I start to explore on my own, and I meet many sleeping chimps sprawled over the forest floor.  One juvenile catches my eye.  He's being absolutely picturesque.  Using a vine as a hammock, he rests in perfect tranquility.  A baby hops around his mother who is being groomed by another.  Seeing this group so close, interacting so intimately, is my favorite part of the day.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'inline', 14); ?>
</div>
<div class="text-section">
    <p>A light rain starts to fall, and the sun sinks lower in the sky.  Seeing we are very far from camp, we cannot wait for this group to nest – though some juveniles give us a little preview.  They pull down branches in nearby trees to find a little shelter from the rain.  We have no choice but to head back.</p>
    <p>Twelve hours after we set off, we arrive back to camp, a little wiser to the day in the life of a chimpanzee.  A complex life that is a mix of solitary and social.  A life where one interacts with family, friends, acquaintances, and enemies.  A life full of emotion from excitement to boredom and fright.  In the fading light, I find myself feeling even closer to our closest animal relative.</p>
</div>
<div class="album-section">
    <?= addAlbum($this, $model, 'full_width', 11); ?>
</div>
