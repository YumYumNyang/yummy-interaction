/*
    performance.now();
    브라우저가 로딩된 순간부터 해당구문이 호출된 시점까지의 시간을 ms단위로 반환
    정밀한 시간계산이 필요할 때 활용
*/

// const btn = document.querySelector('button');
// const box = document.querySelector('#box');
// const speed = 1000;

// let num = 0;
// let startTime = null;

// btn.addEventListener('click', () => {
// 	// startTime = performance.now();
// 	// requestAnimationFrame(move);
// 	anime(box, {
// 		prop: 'left',
// 		value: '50%',
// 		duration: 1000,
// 		// callback: () => {
// 		// 	anime(box, {
// 		// 		prop: 'margin-top',
// 		// 		value: 300,
// 		// 		duration: 500,
// 		// 	});
// 		// },
// 	});
// });
// btn.addEventListener('click', () => {
// 	anime(box, {
// 		prop: 'opacity',
// 		value: 0.2,
// 		duration: 1000,
// 	});
// });
// btn.addEventListener('click', () => {
// 	anime(window, {
// 		prop: 'scroll',
// 		value: 4000,
// 		duration: 1000,
// 		callback: () => {
// 			anime(window, {
// 				prop: 'scroll',
// 				value: 0,
// 				duration: 1000,
// 			});
// 		},
// 	});
// });

// window.scrollY : 현재 스크롤된 거리값 반환(동적)
// DOMEl.offsetTop: 문서 세로 끝에서부터 현재 돔 요소까지의 위치값(정적)
// window.scroll(x, y): x, y축으로 스크롤 강제 이동

class Anime {
	constructor(selector, option) {
		this.selector = selector;
		this.option = option;
		this.startTime = performance.now();
		this.currentValue = null;
		// 옵션의 속성명이 스크롤일때
		if (this.option.prop === 'scroll') {
			this.currentValue = this.selector.scrollY;
		} else {
			this.currentValue = parseFloat(
				getComputedStyle(this.selector)[this.option.prop]
			);
		}
		this.isString = typeof this.option.value;
		if (this.isString === 'string') {
			const x = [
				'margin-left',
				'margin-right',
				'padding-left',
				'padding-right',
				'left',
				'right',
				'width',
			];
			const y = [
				'margin-top',
				'margin-bottom',
				'padding-right: -top',
				'padding-bottom',
				'top',
				'bottom',
				'height',
			];

			this.parentW = parseInt(
				getComputedStyle(this.selector.parentElement).width
			);
			this.parentH = parseInt(
				getComputedStyle(this.selector.parentElement).height
			);
			for (const cond of x) {
				if (this.option.prop === cond) {
					this.currentValue =
						(this.currentValue / this.parentW) * 100;
				}
			}
			for (const cond of y) {
				if (this.option.prop === cond) {
					this.currentValue =
						(this.currentValue / this.parentH) * 100;
				}
			}
			this.option.value = parseFloat(this.option.value);
		}
		this.option.value !== this.currentValue &&
			requestAnimationFrame((time) => this.run(time));
	}
	run(time) {
		const timeLast = time - this.startTime;
		let progress = timeLast / this.option.duration;

		progress < 0 && (progress = 0);
		progress > 1 && (progress = 1);
		progress < 1
			? requestAnimationFrame((time) => this.run(time))
			: this.option.callback &&
			  setTimeout(() => this.option.callback(), 0);

		let result =
			this.currentValue +
			(this.option.value - this.currentValue) * progress;
		if (this.isString === 'string')
			this.selector.style[this.option.prop] = `${result}%`;
		else if (this.option.prop === 'opacity')
			this.selector.style[this.option.prop] = result;
		else if (this.option.prop === 'scroll') {
			this.selector.scroll(0, result);
		} else this.selector.style[this.option.prop] = `${result}px`;
	}
}

// function anime(selector, option) {
// 	const startTime = performance.now();
// 	let currentValue = null;

// 	// 옵션의 속성명이 스크롤일때
// 	if (option.prop === 'scroll') {
// 		currentValue = selector.scrollY;
// 	} else {
// 		currentValue = parseFloat(getComputedStyle(selector)[option.prop]);
// 	}

// 	// 옵션으로 전달받은 속성값이 문자열이면 %처리를 위해 option.value
// 	const isString = typeof option.value;
// 	if (isString === 'string') {
// 		const x = [
// 			'margin-left',
// 			'margin-right',
// 			'padding-left',
// 			'padding-right',
// 			'left',
// 			'right',
// 			'width',
// 		];
// 		const y = [
// 			'margin-top',
// 			'margin-bottom',
// 			'padding-right: -top',
// 			'padding-bottom',
// 			'top',
// 			'bottom',
// 			'height',
// 		];

// 		const parentW = parseInt(
// 			getComputedStyle(selector.parentElement).width
// 		);
// 		const parentH = parseInt(
// 			getComputedStyle(selector.parentElement).height
// 		);
// 		for (const cond of x) {
// 			if (option.prop === cond) {
// 				currentValue = (currentValue / parentW) * 100;
// 			}
// 		}
// 		for (const cond of y) {
// 			if (option.prop === cond) {
// 				currentValue = (currentValue / parentH) * 100;
// 			}
// 		}
// 		option.value = parseFloat(option.value);
// 	}

// 	option.value !== currentValue && requestAnimationFrame(run);

// 	function run(time) {
// 		const timeLast = time - startTime;
// 		let progress = timeLast / option.duration;

// 		progress < 0 && (progress = 0);
// 		progress > 1 && (progress = 1);
// 		progress < 1
// 			? requestAnimationFrame(run)
// 			: option.callback && setTimeout(() => option.callback(), 0);

// 		let result = currentValue + (option.value - currentValue) * progress;
// 		if (isString === 'string') selector.style[option.prop] = `${result}%`;
// 		else if (option.prop === 'opacity')
// 			selector.style[option.prop] = result;
// 		else if (option.prop === 'scroll') {
// 			selector.scroll(0, result);
// 		} else selector.style[option.prop] = `${result}px`;
// 	}

// 	// function move(time) {
// 	// 	// time - requestAnimationFrame의 callback 함수에 자동 전달되는 인수값
// 	// 	// move함수가 반복실행될 때마다의 누적시간;

// 	// 	const timeLast = time - startTime;

// 	// 	// 진행률 (반복된 누적시간 / 전체시간)
// 	// 	// 0~1사이의 실수값을 반환 0: 시작, 1: 종료
// 	// 	let progress = timeLast / option.duration;

// 	// 	// 시작할 때와 끝나는 시점의 진행률을 보정
// 	// 	progress < 0 && (progress = 0);
// 	// 	progress > 1 && (progress = 1);

// 	// 	if (progress < 1) {
// 	// 		// console.log(`반복시 각 싸이클당 움직인 누적거리값 ${500 * progress}px`);
// 	// 		// console.log(
// 	// 		// 	`반복시 변경된 수치값 ${500 * progress}px / 시간: ${timeLast}`
// 	// 		// );
// 	// 		requestAnimationFrame(move);
// 	// 	} else {
// 	// 		option.callback && option.callback();
// 	// 	}
// 	// 	selector.style[option.prop] = `${option.value * progress}px`;
// 	// }
// }
