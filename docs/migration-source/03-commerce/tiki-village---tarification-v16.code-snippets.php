<?php

/**
 * TIKI VILLAGE - Tarification v16
 */
/**
 * TIKI VILLAGE - Tarification v16 Secure
 * + Salon Virtuel (6 février → 1 mars 2026)
 * + Coupons multiples : Dîner-Spectacle / Spectacle seul / Ateliers
 *
 * RÈGLE FONDAMENTALE :
 * - Le prix affiché = toujours le tarif NORMAL
 * - La réduction = uniquement via le code promo
 */

// ============================================================================
// 1. CALCUL DU PRIX (TOUJOURS TARIF NORMAL)
// ============================================================================
add_filter('woocommerce_bookings_calculated_booking_cost', 'tiki_calculate_price', 10, 3);

function tiki_calculate_price($booking_cost, $product, $posted) {

    $product_id = $product->get_id();
    $config = tiki_get_config($product_id);

    if ($config === false) {
        return $booking_cost;
    }

    $year  = intval($posted['_year']  ?? 0);
    $month = intval($posted['_month'] ?? 0);
    $day   = intval($posted['_day']   ?? 0);

    if ($year == 0 || $month == 0 || $day == 0) {
        return $config['min_price'];
    }

    // =====================================================================
    // 🔥 ATELIERS : détection automatique du nombre de personnes
    // =====================================================================
    if ($config['type'] === 'atelier') {

        $persons = 0;

        if (isset($posted['_persons']) && is_array($posted['_persons'])) {
            foreach ($posted['_persons'] as $k => $v) {
                $persons += intval($v);
            }
        }

        if ($persons <= 0) {
            return $config['min_price'];
        }

        return $persons * $config['new_adult'];
    }

    // =====================================================================
    // 🔥 CAS NORMAL (DÎNER / SPECTACLE)
    // =====================================================================

    $adults   = intval($posted['_persons'][$config['adult_id']] ?? 0);
    $children = intval($posted['_persons'][$config['child_id']] ?? 0);

    if ($adults == 0 && $children == 0) {
        return $config['min_price'];
    }

    $total = ($adults * $config['new_adult']) + ($children * $config['new_child']);

    if ($total <= 0) {
        $total = $config['min_price'];
    }

    return $total;
}

// ============================================================================
// 2. CONFIGURATION DES PRODUITS (DÎNER / SPECTACLE / ATELIERS)
// ============================================================================

function tiki_get_config($product_id) {

    $products = array(

        // -----------------------------
        // DÎNER-SPECTACLE (FR / EN / JA)
        // -----------------------------
        157391 => array('name'=>'Diner-spectacle (FR)','adult_id'=>157389,'child_id'=>157390,'promo_adult'=>10500,'promo_child'=>4950,'new_adult'=>12500,'new_child'=>5950,'min_price'=>4950,'type'=>'diner_spectacle'),
        157393 => array('name'=>'Dinner and show (EN)','adult_id'=>193905,'child_id'=>193906,'promo_adult'=>10500,'promo_child'=>4950,'new_adult'=>12500,'new_child'=>5950,'min_price'=>4950,'type'=>'diner_spectacle'),
        157394 => array('name'=>'Dinner show (JA)','adult_id'=>193907,'child_id'=>193908,'promo_adult'=>10500,'promo_child'=>4950,'new_adult'=>12500,'new_child'=>5950,'min_price'=>4950,'type'=>'diner_spectacle'),

        // -----------------------------
        // SPECTACLE SEUL (FR / EN / JA)
        // -----------------------------
        157501 => array('name'=>'Spectacle Seul (FR)','adult_id'=>157499,'child_id'=>157500,'promo_adult'=>4950,'promo_child'=>2500,'new_adult'=>6200,'new_child'=>2950,'min_price'=>2500,'type'=>'spectacle_seul'),
        157582 => array('name'=>'Show only (EN)','adult_id'=>193946,'child_id'=>193947,'promo_adult'=>4950,'promo_child'=>2500,'new_adult'=>6200,'new_child'=>2950,'min_price'=>2500,'type'=>'spectacle_seul'),
        157581 => array('name'=>'Show (JA)','adult_id'=>193948,'child_id'=>193949,'promo_adult'=>4950,'promo_child'=>2500,'new_adult'=>6200,'new_child'=>2950,'min_price'=>2500,'type'=>'spectacle_seul'),

		// -----------------------------
		// ATELIERS (FR / EN / JA)
		// -----------------------------
		// 1 atelier = 3500 normal → 2800 promo
		// 3 ateliers = 7000 normal → 5600 promo

		// FR
		157606 => array(
			'name'=>'1 Atelier culturel (FR)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>2800,
			'promo_child'=>0,
			'new_adult'=>3500,
			'new_child'=>0,
			'min_price'=>3500,   // prix normal
			'type'=>'atelier'
		),

		157644 => array(
			'name'=>'3 Ateliers culturels (FR)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>5600,
			'promo_child'=>0,
			'new_adult'=>7000,
			'new_child'=>0,
			'min_price'=>7000,   // prix normal
			'type'=>'atelier'
		),

		// EN
		157612 => array(
			'name'=>'1 Cultural workshop (EN)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>2800,
			'promo_child'=>0,
			'new_adult'=>3500,
			'new_child'=>0,
			'min_price'=>3500,   // prix normal
			'type'=>'atelier'
		),

		157656 => array(
			'name'=>'3 Cultural workshops (EN)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>5600,
			'promo_child'=>0,
			'new_adult'=>7000,
			'new_child'=>0,
			'min_price'=>7000,   // prix normal
			'type'=>'atelier'
		),

		// JA
		157615 => array(
			'name'=>'1 Cultural workshop (JA)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>2800,
			'promo_child'=>0,
			'new_adult'=>3500,
			'new_child'=>0,
			'min_price'=>3500,   // prix normal
			'type'=>'atelier'
		),

		157655 => array(
			'name'=>'3 Cultural workshops (JA)',
			'adult_id'=>0,
			'child_id'=>0,
			'promo_adult'=>5600,
			'promo_child'=>0,
			'new_adult'=>7000,
			'new_child'=>0,
			'min_price'=>7000,   // prix normal
			'type'=>'atelier'
		),
    );

    return $products[$product_id] ?? false;
}

// ============================================================================
// 2B. LISTES DE PRODUITS PAR TYPE
// ============================================================================

function tiki_get_diner_spectacle_ids() {
    return array(
        // Dîner-spectacle
        157391,157393,157394,

        // Spectacle seul
        157501,157582,157581
    );
}

function tiki_get_spectacle_seul_ids() {
    return array(157501,157582,157581);
}

function tiki_get_atelier_ids() {
    return array(157606,157644,157612,157656,157615,157655);
}

function tiki_get_salon_eligible_ids() {
    return array_merge(
        tiki_get_diner_spectacle_ids(),
        tiki_get_spectacle_seul_ids(),
        tiki_get_atelier_ids()
    );
}
function tiki_get_atelier_1_ids() {
    return array(157606,157612,157615);
}

function tiki_get_atelier_3_ids() {
    return array(157644,157656,157655);
}


// ============================================================================
// 2C. CONFIG SALON VIRTUEL (3 COUPONS)
// ============================================================================
function tiki_get_salon_virtuel_config() {
    return array(

        // Dîner-Spectacle / Spectacle seul
        'coupon_diner' => 'R8G3P4BR',

        // Ateliers
        'coupon_atelier_1' => 'H9JQXMR9',   // 1 atelier
        'coupon_atelier_3' => 'HBF9JBFJ',   // 3 ateliers

        // Périodes
        'order_start_date'   => '2026-02-06',
        'order_end_date'     => '2026-03-01',
        'booking_start_date' => '2026-02-06',
        'booking_end_date'   => '2026-05-31',
    );
}


function tiki_is_salon_virtuel_active() {
    $c = tiki_get_salon_virtuel_config();
    $now = current_time('timestamp');
    return ($now >= strtotime($c['order_start_date']) && $now <= strtotime($c['order_end_date'].' 23:59:59'));
}

function tiki_is_booking_date_eligible($booking_date) {
    $c = tiki_get_salon_virtuel_config();
    $ts = is_string($booking_date) ? strtotime($booking_date) : $booking_date;
    return ($ts >= strtotime($c['booking_start_date']) && $ts <= strtotime($c['booking_end_date'].' 23:59:59'));
}

// ============================================================================
// 3. VALIDATION COUPON (DÎNER / SPECTACLE / ATELIER)
// ============================================================================

add_filter('woocommerce_coupon_is_valid', 'tiki_validate_salon_coupon', 10, 3);

function tiki_validate_salon_coupon($is_valid, $coupon, $discount) {

    $c = tiki_get_salon_virtuel_config();
    $code = strtoupper($coupon->get_code());

    $is_diner_coupon     = ($code === strtoupper($c['coupon_diner']));
    $is_atelier_1_coupon = ($code === strtoupper($c['coupon_atelier_1']));
    $is_atelier_3_coupon = ($code === strtoupper($c['coupon_atelier_3']));

    if (! $is_diner_coupon && ! $is_atelier_1_coupon && ! $is_atelier_3_coupon) {
        return $is_valid;
    }

    if (! tiki_is_salon_virtuel_active()) {
        throw new Exception("Ce code promo n'est pas valable en dehors du Salon Virtuel (6 fév → 1 mars 2026).");
    }

    $cart = WC()->cart;
    if (! $cart) return false;

    $has_valid_product = false;
    $has_bad_date = false;

    foreach ($cart->get_cart() as $item) {

        $pid = $item['product_id'];

        if ($is_diner_coupon && in_array($pid, tiki_get_diner_spectacle_ids())) {
            $has_valid_product = true;
        }

        if ($is_atelier_1_coupon && in_array($pid, tiki_get_atelier_1_ids())) {
            $has_valid_product = true;
        }

        if ($is_atelier_3_coupon && in_array($pid, tiki_get_atelier_3_ids())) {
            $has_valid_product = true;
        }

        $booking_date = tiki_get_booking_date_from_cart_item($item);
        if ($booking_date && ! tiki_is_booking_date_eligible($booking_date)) {
            $has_bad_date = true;
        }
    }

    if (! $has_valid_product) {
        throw new Exception("Ce code promo ne s'applique pas à ce produit.");
    }

    if ($has_bad_date) {
        throw new Exception("Ce code promo est valable uniquement pour les réservations du 6 février au 31 mai 2026.");
    }

    return true;
}

// ============================================================================
// 4. CALCUL DE LA RÉDUCTION (DÎNER / SPECTACLE / ATELIER)
// ============================================================================

add_filter('woocommerce_coupon_get_discount_amount','tiki_salon_discount_calculation',10,5);

function tiki_salon_discount_calculation($discount,$discounting_amount,$item,$single,$coupon){

    $c = tiki_get_salon_virtuel_config();
    $code = strtoupper($coupon->get_code());

    $is_diner_coupon     = ($code === strtoupper($c['coupon_diner']));
    $is_atelier_1_coupon = ($code === strtoupper($c['coupon_atelier_1']));
    $is_atelier_3_coupon = ($code === strtoupper($c['coupon_atelier_3']));

    $pid = $item['product_id'];
    $config = tiki_get_config($pid);

    if (! $config) return 0;

    $booking_date = tiki_get_booking_date_from_cart_item($item);
    if ($booking_date && ! tiki_is_booking_date_eligible($booking_date)) {
        return 0;
    }

    // Dîner / Spectacle
    if ($is_diner_coupon && in_array($pid, tiki_get_diner_spectacle_ids())) {

        $adults   = intval($item['booking']['_persons'][$config['adult_id']] ?? 0);
        $children = intval($item['booking']['_persons'][$config['child_id']] ?? 0);

        return
            $adults   * ($config['new_adult'] - $config['promo_adult']) +
            $children * ($config['new_child'] - $config['promo_child']);
    }

    // 1 atelier
    if ($is_atelier_1_coupon && in_array($pid, tiki_get_atelier_1_ids())) {
        return ($config['new_adult'] - $config['promo_adult']);
    }

    // 3 ateliers
    if ($is_atelier_3_coupon && in_array($pid, tiki_get_atelier_3_ids())) {
        return ($config['new_adult'] - $config['promo_adult']);
    }

    return 0;
}


// ============================================================================
// 5. MARQUER COMMANDE SALON VIRTUEL
// ============================================================================

add_action('woocommerce_checkout_order_processed','tiki_tag_salon_virtuel_order',5,3);

function tiki_tag_salon_virtuel_order($order_id,$posted,$order){

    if (! $order) $order = wc_get_order($order_id);

    $c = tiki_get_salon_virtuel_config();
    $codes = $order->get_coupon_codes();

    if (in_array(strtolower($c['coupon_diner']), $codes) ||
        in_array(strtolower($c['coupon_atelier']), $codes)) {

        $order->update_meta_data('_tiki_salon_virtuel','oui');
        $order->update_meta_data('_tiki_salon_virtuel_date',current_time('Y-m-d H:i:s'));
        $order->save();
    }
}
// ============================================================================
// 6. BANNIÈRE SALON VIRTUEL (DÎNER / SPECTACLE / ATELIER)
// ============================================================================
add_action('woocommerce_before_add_to_cart_button', 'tiki_salon_virtuel_banner', 5);

function tiki_salon_virtuel_banner() {

    global $product;
    if (! $product) return;

    $pid = $product->get_id();
    $config = tiki_get_config($pid);
    if (! $config) return;

    $c    = tiki_get_salon_virtuel_config();
    $lang = defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : 'fr';

    // Vérifier période Salon Virtuel
    $now   = current_time('timestamp');
    $start = strtotime($c['order_start_date']);
    $end   = strtotime($c['order_end_date'].' 23:59:59');
    if ($now < $start || $now > $end) return;

    // =====================================================================
    // 1) DÎNER / SPECTACLE
    // =====================================================================
    if (in_array($pid, tiki_get_diner_spectacle_ids()) ||
        in_array($pid, tiki_get_spectacle_seul_ids())) {

        $normal_adult = number_format($config['new_adult'], 0, ',', ' ');
        $promo_adult  = number_format($config['promo_adult'], 0, ',', ' ');

        $normal_child = number_format($config['new_child'], 0, ',', ' ');
        $promo_child  = number_format($config['promo_child'], 0, ',', ' ');

        $code = $c['coupon_diner'];

        if ($lang === 'en') {
            $msg = "
                <strong>🎪 Virtual Fair Special!</strong><br>
                Adult: <del>{$normal_adult}</del> → <strong>{$promo_adult} XPF</strong><br>
                Child: <del>{$normal_child}</del> → <strong>{$promo_child} XPF</strong><br>
                Use code: <code>{$code}</code>
            ";
        }
        elseif ($lang === 'ja') {
            $msg = "
                <strong>🎪 バーチャルフェア特別！</strong><br>
                大人: <del>{$normal_adult}</del> → <strong>{$promo_adult} XPF</strong><br>
                子供: <del>{$normal_child}</del> → <strong>{$promo_child} XPF</strong><br>
                コード: <code>{$code}</code>
            ";
        }
        else {
            $msg = "
                <strong>🎪 Offre Salon Virtuel !</strong><br>
                Adulte : <del>{$normal_adult}</del> → <strong>{$promo_adult} XPF</strong><br>
                Enfant : <del>{$normal_child}</del> → <strong>{$promo_child} XPF</strong><br>
                Code promo : <code>{$code}</code>
            ";
        }

        echo '<div class="tiki-banner" style="margin-bottom:20px;padding:15px;background:#e8eaf6;border-left:5px solid #3f51b5;border-radius:6px;">'.$msg.'</div>';
        return;
    }

    // =====================================================================
    // 2) ATELIERS — Détection 100% par IDs
    // =====================================================================

    // 1 atelier
    if (in_array($pid, tiki_get_atelier_1_ids())) {

        $code = $c['coupon_atelier_1'];
        $normal = number_format($config['new_adult'], 0, ',', ' ');
        $promo  = number_format($config['promo_adult'], 0, ',', ' ');

        if ($lang === 'en') {
            $msg = "
                <strong>🎪 Virtual Fair Special!</strong><br>
                Workshop: <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                Use code: <code>{$code}</code>
            ";
        }
        elseif ($lang === 'ja') {
            $msg = "
                <strong>🎪 バーチャルフェア特別！</strong><br>
                ワークショップ: <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                コード: <code>{$code}</code>
            ";
        }
        else {
            $msg = "
                <strong>🎪 Offre Salon Virtuel !</strong><br>
                Atelier : <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                Code promo : <code>{$code}</code>
            ";
        }

        echo '<div class="tiki-banner" style="margin-bottom:20px;padding:15px;background:#fff3e0;border-left:5px solid #ff9800;border-radius:6px;">'.$msg.'</div>';
        return;
    }

    // 3 ateliers
    if (in_array($pid, tiki_get_atelier_3_ids())) {

        $code = $c['coupon_atelier_3'];
        $normal = number_format($config['new_adult'], 0, ',', ' ');
        $promo  = number_format($config['promo_adult'], 0, ',', ' ');

        if ($lang === 'en') {
            $msg = "
                <strong>🎪 Virtual Fair Special!</strong><br>
                3 Workshops: <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                Use code: <code>{$code}</code>
            ";
        }
        elseif ($lang === 'ja') {
            $msg = "
                <strong>🎪 バーチャルフェア特別！</strong><br>
                ３つのワークショップ: <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                コード: <code>{$code}</code>
            ";
        }
        else {
            $msg = "
                <strong>🎪 Offre Salon Virtuel !</strong><br>
                3 Ateliers : <del>{$normal}</del> → <strong>{$promo} XPF</strong><br>
                Code promo : <code>{$code}</code>
            ";
        }

        echo '<div class="tiki-banner" style="margin-bottom:20px;padding:15px;background:#fff3e0;border-left:5px solid #ff9800;border-radius:6px;">'.$msg.'</div>';
        return;
    }
}


// ============================================================================
// 7. CSS TRANSFERT (DÎNER-SPECTACLE)
// ============================================================================

add_action('wp_head', 'tiki_transfer_css');

function tiki_transfer_css() {
    if (! is_product()) return;

    global $product;
    if (! $product) return;

    if (! in_array($product->get_id(), tiki_get_diner_spectacle_ids())) return;

    echo '<style>.tiki-transfer-hidden{display:none!important;}</style>';
}

// ============================================================================
// 8. JS DYNAMIQUE (TRANSFERT + BANNIÈRES)
// ============================================================================

add_action('wp_footer', 'tiki_dynamic_display_js');

function tiki_dynamic_display_js() {

    if (! is_product()) return;

    global $product;
    if (! $product) return;

    $pid = $product->get_id();
    $config = tiki_get_config($pid);
    if (! $config) return;

    $c = tiki_get_salon_virtuel_config();
    $salon_active = tiki_is_salon_virtuel_active();

    // Détection fiable par ID
    $isDiner = in_array($pid, tiki_get_diner_spectacle_ids());
    ?>

<script>
(function($){

    var isDiner = <?php echo $isDiner ? 'true' : 'false'; ?>;
    var salonActive = <?php echo $salon_active ? 'true' : 'false'; ?>;

    // ------------------------------------------------------------
    // 1) MASQUER / AFFICHER LES TRANSFERTS
    // ------------------------------------------------------------

    $(document).ready(function(){

    // Champs transferts (IDs WooCommerce Bookings)
    var tAdultHeading = $('#wc_bookings_field_1744870537_field');
    var tAdultInput   = $('#wc_bookings_field_1744870538_field');

    var tChildHeading = $('#wc_bookings_field_1744870539_field');
    var tChildInput   = $('#wc_bookings_field_1744870540_field');

    if (isDiner && !salonActive) {

        // Dîner-Spectacle hors promo → masquer transferts
        tAdultHeading.hide();
        tAdultInput.hide();
        tChildHeading.hide();
        tChildInput.hide();

    } else {

        // Spectacle seul + Ateliers + Dîner-Spectacle en promo → afficher transferts
        tAdultHeading.show();
        tAdultInput.show();
        tChildHeading.show();
        tChildInput.show();
    }
});


    // ------------------------------------------------------------
    // 2) GESTION DYNAMIQUE (Dîner-Spectacle uniquement)
    // ------------------------------------------------------------

    function getSelectedDate() {
        var y = $('input[name="_year"]').val() || $('input[name="wc_bookings_field_start_date_year"]').val();
        var m = $('input[name="_month"]').val() || $('input[name="wc_bookings_field_start_date_month"]').val();
        var d = $('input[name="_day"]').val() || $('input[name="wc_bookings_field_start_date_day"]').val();
        if (y && m && d) return new Date(y, m-1, d);
        return null;
    }

    function updateDisplay() {
        if (!isDiner) return;

        var date = getSelectedDate();
        if (!date) return;

        var start = new Date('<?php echo $c['booking_start_date']; ?>T00:00:00');
        var end   = new Date('<?php echo $c['booking_end_date']; ?>T23:59:59');

        var eligible = (date >= start && date <= end);

        if (eligible) {
            $('.tiki-transfer-hidden').show();
        } else {
            $('.tiki-transfer-hidden').hide();
        }
    }

    $(document).on('change click', 'input, .ui-datepicker-calendar a', function(){
        setTimeout(updateDisplay, 200);
    });

    $(document).ready(updateDisplay);

})(jQuery);
</script>

<?php
}


// ============================================================================
// 9. BLOQUER CHECKOUT SI PRIX = 0
// ============================================================================

add_action('woocommerce_checkout_process', 'tiki_block_zero_checkout');

function tiki_block_zero_checkout() {

    if (! WC()->cart) return;

    foreach (WC()->cart->get_cart() as $item) {
        if (floatval($item['line_total']) <= 0) {
            wc_add_notice("Erreur de tarification détectée. Veuillez réessayer.", "error");
            return;
        }
    }
}

// ============================================================================
// 10. BLOQUER COMMANDE SI TOTAL = 0
// ============================================================================

add_action('woocommerce_checkout_order_processed','tiki_check_order_total',10,3);

function tiki_check_order_total($order_id,$posted,$order){

    if (! $order) $order = wc_get_order($order_id);

    if (floatval($order->get_total()) <= 0) {
        $order->update_status('on-hold', 'Commande mise en attente : total = 0 XPF');
    }
}
// ============================================================================
// 11. BLOQUER AJOUT AU PANIER SI PRIX = 0
// ============================================================================

add_filter('woocommerce_add_to_cart_validation', 'tiki_validate_add_to_cart', 10, 5);

function tiki_validate_add_to_cart($passed, $product_id, $quantity, $variation_id = 0, $variations = array()) {

    $config = tiki_get_config($product_id);
    if (! $config) return $passed;

    // Si WooCommerce renvoie un booking_cost = 0 → erreur
    if (isset($_POST['booking_cost']) && floatval($_POST['booking_cost']) <= 0) {
        tiki_log("AJOUT PANIER BLOQUÉ: Produit $product_id avec booking_cost 0");
        wc_add_notice("Erreur de tarification. Veuillez réessayer.", "error");
        return false;
    }

    return $passed;
}

// ============================================================================
// 12. FONCTION DE LOG
// ============================================================================

function tiki_log($message) {
    $file = WP_CONTENT_DIR . '/tiki-security.log';
    $entry = date('Y-m-d H:i:s') . " - " . $message . PHP_EOL;
    file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);
}

// ============================================================================
// 13. ALERTE EMAIL ADMIN
// ============================================================================

function tiki_send_alert($subject, $message) {
    $admin = get_option('admin_email');
    $full_subject = "[TIKI ALERTE] $subject";
    $full_message = "Date: " . date('Y-m-d H:i:s') . "\n\n" . $message;
    wp_mail($admin, $full_subject, $full_message);
}
// ============================================================================
// 14. NOTICE ADMIN : COMMANDES À 0 XPF
// ============================================================================

add_action('admin_notices', 'tiki_admin_warning');

function tiki_admin_warning() {

    if (! current_user_can('manage_woocommerce')) return;

    $screen = get_current_screen();
    if (! $screen || $screen->id !== 'edit-shop_order') return;

    global $wpdb;

    $count = $wpdb->get_var("
        SELECT COUNT(*)
        FROM {$wpdb->posts} p
        JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
        WHERE p.post_type = 'shop_order'
        AND pm.meta_key = '_order_total'
        AND pm.meta_value IN ('0','0.00')
        AND p.post_status NOT IN ('trash','wc-cancelled')
    ");

    if ($count > 0) {
        echo '<div class="notice notice-error"><p>';
        echo '<strong>Attention :</strong> ' . $count . ' commande(s) à 0 XPF détectée(s).';
        echo '</p></div>';
    }
}

// ============================================================================
// 15. MESSAGE PROMO (Décembre 2025 → Janvier 2026)
// ============================================================================

add_action('woocommerce_before_add_to_cart_button', 'tiki_promo_message');

function tiki_promo_message() {

    global $product;
    if (! $product) return;

    $pid = $product->get_id();
    $config = tiki_get_config($pid);
    if (! $config) return;

    // Promo uniquement pour les anciens tarifs (décembre–janvier)
    $today = strtotime('today');
    $promo_end = strtotime('2026-01-31');

    if ($today > $promo_end) return;

    $lang = defined('ICL_LANGUAGE_CODE') ? ICL_LANGUAGE_CODE : 'fr';
    $promo = number_format($config['promo_adult'], 0, ',', ' ');

    if ($lang === 'en') {
        $msg = "<strong>Special Offer!</strong> Reduced rate: <strong>{$promo} XPF</strong> for bookings until January 31, 2026.";
    }
    elseif ($lang === 'ja') {
        $msg = "<strong>特別オファー！</strong> 割引料金: <strong>{$promo} XPF</strong>（2026年1月31日まで）";
    }
    else {
        $msg = "<strong>Offre promotionnelle !</strong> Tarif réduit : <strong>{$promo} XPF</strong> pour les réservations jusqu'au 31 janvier 2026.";
    }

    echo '<div style="margin-bottom:20px;padding:15px;background:#fff3e0;border-left:4px solid #ff9800;border-radius:4px;">'.$msg.'</div>';
}

// ============================================================================
// FONCTION UTILITAIRE : EXTRAIRE DATE DE RÉSERVATION
// ============================================================================

function tiki_get_booking_date_from_cart_item($item) {

    if (isset($item['booking']['_year'])) {
        $y = intval($item['booking']['_year']);
        $m = intval($item['booking']['_month']);
        $d = intval($item['booking']['_day']);
        if ($y && $m && $d) return strtotime("$y-$m-$d");
    }

    if (isset($item['booking']['date'])) {
        $ts = strtotime($item['booking']['date']);
        if ($ts) return $ts;
    }

    return false;
}

// ============================================================================
// FIN DU FICHIER
// ============================================================================
