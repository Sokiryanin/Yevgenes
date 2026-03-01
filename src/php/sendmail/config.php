<?

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

// Загрузка конфигурации из .env
$env = parse_ini_file(__DIR__ . '/../../../.env');

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('uk', 'phpmailer/language/');
$mail->IsHTML(true);

$mail->isSMTP(); // Send using SMTP
$mail->Host       = $env['SMTP_HOST']; // Set the SMTP server to send through
$mail->SMTPAuth = true; // Enable SMTP authentication
$mail->Username   = $env['SMTP_USER']; // SMTP username (email)
$mail->Password   = $env['SMTP_PASS']; // SMTP password (Google Account -> Security -> App passwords -> Add)

$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->Port = 465;
