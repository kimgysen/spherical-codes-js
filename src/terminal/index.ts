
import figlet from 'figlet';
import {Command} from "commander";
import shell from 'shelljs';
import circlesToVerifyJSON from "../browser/component/thoroidal_circles/upload_json/CirclesToVerifyJSON";
import {buildContactGraph} from "../common/lib/contact_graph/ContactGraphLib";
import {gradientDescent} from "../common/lib/contact_graph/GradientDescentLib";

//
// console.log(figlet.textSync("Spherical Codes"));
//
// const program = new Command();
//
// program
// 	.name('spherical-codes')
// 	.description('CLI to use Spherical Codes utilities')
// 	.version('1.0.0');
//
// program
// 	.command('site')
// 	.description('Run the spherical codes website')
// 	.option("-c, --config <value>", "Pass a configuration file")
// 	.action(() => {
// 		shell.exec('npm run start:browser');
// 	});
//
// program.parse();

const circles = circlesToVerifyJSON;
const gradientCg = buildContactGraph(circles, 3, true);
gradientDescent(gradientCg, 600000);
console.log(gradientCg);
