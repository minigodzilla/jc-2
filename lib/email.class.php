<?php

	class CEmail {
		
		var $mAttachments = array();
		var $mHeaders = "";
		var $mTemplate = "";
		var $mParams = array();
		var $mFrom = "";
		var $mFromAddress = "";

		/** comment here */
		function CEmail($params = array()) {
			$this->mParams = $params;
		}

		/** comment here */
		function addHeader($txt) {
			$this->mHeaders .= $txt . "\n";
		}
	

		/** comment here */
		function send($to, $subject, $message) {
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

			if (!$this->mFrom) $this->mFrom = EMAIL_FROM;
			if (!$this->mFromAddress) $this->mFromAddress = EMAIL_FROM_ADDRESS;

			$headers .= 'From: '.EMAIL_FROM.' <'.EMAIL_FROM_ADDRESS.'>' . "\r\n";

			$this->mail($this->mFrom, $this->mFromAddress, $to, $to, $subject, $message);
		}


		/** comment here */
		function sendtoAdmin($subject, $message) {
			if (!$this->mFrom) $this->mFrom = EMAIL_FROM;
			if (!$this->mFromAddress) $this->mFromAddress = EMAIL_FROM_ADDRESS;

			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
			$headers .= 'From: '.EMAIL_FROM.' <'.EMAIL_FROM_ADDRESS.'>' . "\r\n";

			$this->mail($this->mFrom, $this->mFromAddress, EMAIL_ADMIN, EMAIL_ADMIN, $subject, $message);

			
		}
		
		/** comment here */
		function sendRich($to, $subject, $template) {
			$tpl = file_get_contents("assets/email/" . $template . ".html");
			foreach ($this->mParams as $key=>$val) {
				$tpl->assign($key, nl2br($val));
				$tpl = str_replace("{" . $key . "}", nl2br($val), $tpl);
			}
			$txt = $tpl;

			if (!$this->mFrom) $this->mFrom = EMAIL_FROM;
			if (!$this->mFromAddress) $this->mFromAddress = EMAIL_FROM_ADDRESS;

			$this->mail($this->mFrom, $this->mFromAddress, $to, $to, $subject, $txt, $this->mAttachments);
		}

		/** comment here */
		function sendtoAdminRich($subject, $template) {
			$tpl = file_get_contents("assets/email/" . $template . ".html");
			foreach ($this->mParams as $key=>$val) {
				$tpl->assign($key, nl2br($val));
				$tpl = str_replace("{" . $key . "}", nl2br($val), $tpl);
			}
			$txt = $tpl;

			if (!$this->mFrom) $this->mFrom = EMAIL_FROM;
			if (!$this->mFromAddress) $this->mFromAddress = EMAIL_FROM_ADDRESS;
			$this->mail(EMAIL_FROM, EMAIL_FROM_ADDRESS, EMAIL_ADMIN, EMAIL_ADMIN, $subject, $txt, $this->mAttachments);
		}

		/** comment here */
		private function mail($from, $fromAddress, $to, $toAddress, $subject, $message, $attachments) {

//			$tpl = template2("html/" . $_SESSION["lang"] . "/email.master.html");
//			$tpl->assign("Body", $message);
//			$txt = $tpl->output();
			$txt = $message;

			
			ini_set("sendmail_from", SENDER_FROM);

			$mail = new PHPMailer();
			$mail->From = $fromAddress;
			$mail->Sender = $fromAddress;
			$mail->FromName = $from;
			$mail->AddAddress($toAddress,$to);
			$mail->AddReplyTo($fromAddress, $from);

			$mail->Priority = 3;
			$mail->WordWrap = 250;  // set word wrap to 50 characters
			$mail->IsHTML(true);

			if ($attachments) {
				foreach ($attachments as $key=>$val) {
					$mail->AddAttachment($val);
				}
			}
			$mail->Subject = $subject;
			$mail->Body    = $txt;
			$mail->AltBody    = $txt;
			$ret = $mail->Send();
			$mail->ClearAddresses();
			Return $ret;
		}


	}
?>