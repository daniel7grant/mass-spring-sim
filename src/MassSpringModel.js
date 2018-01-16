/**
 * Creates a mechanical model for a mass-spring-damper system.
 * This equation can be written as follows:
 * 		m*x''(t) + b*x'(t) + k*x(t) = f*sin(w*t)
 * Converting this to discrete time, we get:
 * 		m*x''[t] + b*x'[t] + k*x[t] = f*sin(w*t)
 * We can calculate the derivatives, as follows:
 * 		x'[t] = (x[t] - x[t-dt])/dt
 * 		x''[t] = (x'[t] - x'[t-dt])/dt = (x[t] - 2*x[t-dt] + x[t-2*dt])/(dt^2)
 * After substitution:
 * 		m*(x[t] - 2*x[t-dt] + x[t-2*dt])/(dt^2) + b*(x[t] - x[t-dt])/dt + k*x[t] = f*sin(w*t)
 * Rearrange:
 * 		(m/(dt^2) + b/dt + k)*x[t] - (2*m/(dt^2) + b/dt)*x[t-dt] + m/(dt^2)*x[t-2*dt] = f*sin(w*t)
 * This yields:
 * 		x[t] = (f*sin(w*t) + (2*m/(dt^2) + b/dt)*x[t-dt] - m/(dt^2)*x[t-2*dt])/(m/(dt^2) + b/dt + k)
 * This way, with the knowledge of the two previous displacement, we are able to calculate the current.
 * 
 */
export default class MassSpringModel {

	/**
	 * Construct the mass-spring model with the defined constants
	 * @param {Number} m the mass at the end of the spring
	 * @param {Number} b the damping constant
	 * @param {Number} k the spring constant
	 * @param {Number} f the amplitude of the force
	 * @param {Number} w the frequency of the force
	 * @param {Number} x0 the starting value
	 */
	constructor(m = 0, b = 0, k = 0, f = 0, w = 0, x0 = 0) {
		this.m = m;
		this.b = b;
		this.k = k;
		this.f = f;
		this.w = w;
		this.x0 = x0;

		/** The displacement of the mass, and two previous values */
		this.x = [x0 || 0, 0, 0];
		/** The time function */
		this.t = 0;
	}

	/**
	 * Calculate the next discrete step 
	 * @param {Number} dt the time difference
	 */
	next(dt) {
		this.t += dt;
		this.ft = this.f * Math.sin(this.w * this.t);
		let x0 = (this.ft + (this.b/dt + 2*this.m/dt/dt) * this.x[0] - this.m/dt/dt * this.x[1]) / (this.k + this.b /dt + this.m/dt/dt);
		this.x.unshift(x0);
		return x0;
	}

	/**
	 * Gets the value of the parameter
	 * @param {String} which the name of the parameter
	 */
	getData(which){
		return this[which];
	}

	/**
	 * Sets the value of the parameter
	 * @param {String} which the name of the parameter
	 * @param {*} to the new value
	 */
	setData(which, to){
		this[which] = to;
	}
}