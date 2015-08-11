		var contactsFeedbackForm_IsSubmit = false;

		$(function () {

			$('.phone-mask').mask('+7 (999) 999-9999');

			var validator = $("#contactsFeedbackForm").data("validator");
			validator.settings.submitHandler = function (form) {
				if (contactsFeedbackForm_IsSubmit) return false;
				var options = {
					url: form.action,
					type: 'POST',
					dataType: 'json',
					resetForm: false,
					error: contactsFeedbackForm_submitError,
					success: contactsFeedbackForm_submitSuccess
				};
				contactsFeedbackForm_IsSubmit = true;
				$(form).find('input[type="submit"]').attr('disabled', 'disabled');
				$(form).find('input[type="submit"]').val('Отправка...');
				$(form).ajaxSubmit(options);
			};
		})

		function contactsFeedbackForm_submitError(response, status, xhr, form) {
			alert('Ошибка при отправке формы, не удалось отправить заявку.\n' + status + ': ' + xhr);
			contactsFeedbackForm_IsSubmit = false;
			$(form).find('input[type="submit"]').removeAttr('disabled');
			$(form).find('input[type="submit"]').val('Отправить');
		}

		function contactsFeedbackForm_submitSuccess(response, status, xhr, form) {
			contactsFeedbackForm_IsSubmit = false;
			if (response.success) {
				try {
					//конверсии
					GTM.push("Обратная связь", "Задать вопрос");
					GTM.conversion(
						response.name,
						response.phone,
						response.email,
						"Получить консультацию",
						"contacts",
						response.request_id,
						null,
						"Заявка на консультацию сайт"
					);
				} catch (_) { }

				$(form).resetForm();
				$(form).find('input[type="submit"]').removeAttr('disabled');
				$(form).find('input[type="submit"]').val('Отправить');
				$('.bcs_bank.contact-form-ask .first').hide();
				$('.bcs_bank.contact-form-ask .second').show();
			} else {
				message('Контакты', 'Ошибка при обработке формы, не удалось отправить заявку.');
			}
		}
