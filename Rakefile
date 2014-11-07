@BUILDDIR = 'build'
@COMPASSCONFIG = 'config'

class String
  def green; "\033[32m#{self}\033[0m" end
  def blue;  "\033[34m#{self}\033[0m" end
  def cyan;  "\033[36m#{self}\033[0m" end
  def red;   "\033[31m#{self}\033[0m" end
  def bold;  "\033[1m#{self}\033[22m" end
end

task :clean do
  sh "rm -rf #{@BUILDDIR}"
  sh "bundle exec compass clean #{@COMPASSCONFIG}"
end

task :css do
  sh "bundle exec compass compile #{@COMPASSCONFIG}"
end

task :js do
  sh "rm -rf #{@BUILDDIR}/script > /dev/null 2>&1"
  sh "mkdir #{@BUILDDIR}/script"
  sh ". ./config/concatjs.sh"
  sh "cp -r libs #{@BUILDDIR}/libs"
end

task :doc do
  sh "bundle exec hologram ./config/hologram_config.yml"
end

task :build_test do
  sh "bundle exec hologram ./config/hologram_config.yml --css-test"
end

task :generate_images, [:out_dir] do |t, args|
  server_pid = Process.spawn('ruby -run -ehttpd . -p40001', :err=>"/dev/null")
  puts "Preparing tests/#{args[:out_dir]}".blue.bold
  sh "mkdir -p tests/#{args[:out_dir]}"
  sh "rm -f tests/#{args[:out_dir]}/*.png"

  puts "Generating base images".blue.bold
  for file in Dir["tests/*.html"]
    file = file.sub('tests/', '')
    sh "slimerjs config/image.js http://localhost:40001/tests/#{file} tests/#{args[:out_dir]}"
  end

  Process.kill('TERM', server_pid)
  Process.waitpid server_pid
end

task :compare do
  puts "Preparing tests/compare".blue.bold
  sh "mkdir -p tests/compare"
  sh "rm -f tests/compare/*.png"

  for file in Dir["tests/*.html"]
    file = file.sub('tests/', '')
    base_md5 = `md5 -q tests/base/#{file}.png`
    new_md5 = `md5 -q tests/new/#{file}.png`

    if (base_md5 == new_md5)
      puts "OK".green.bold + "...#{file}"
    else
      puts "CHANGES".red.bold + "...#{file}"
      `compare tests/base/#{file}.png tests/new/#{file}.png tests/compare/#{file}.png`
    end
  end
end

task :generate_report, [:out_dir, :new_label, :base_label] do |t, args|
  sh "mkdir -p reports/#{args[:out_dir]}"
  require 'erb'
  require 'ostruct'

  vars = {:files => [], :new_label => args[:new_label], :base_label => args[:base_label]}
  for file in Dir["tests/compare/*.png"]
    base = file.sub('tests/compare/', '')
    name = base.sub('.html', '').sub('.png', '')
    vars[:files].push({
      :name => name,
      :compare => "#{name}_compare.png",
      :base => "#{name}_base.png",
      :new => "#{name}_new.png"
    })

    sh "cp #{file} reports/#{args[:out_dir]}/#{name}_compare.png"
    sh "cp tests/base/#{base} reports/#{args[:out_dir]}/#{name}_base.png"
    sh "cp tests/new/#{base} reports/#{args[:out_dir]}/#{name}_new.png"
  end

  erb = ERB.new(File.read("config/css_report.html.erb"))
  fh = File.open("reports/#{args[:out_dir]}/index.html", 'w')
  fh.write(erb.result(OpenStruct.new(vars).instance_eval { binding }))
end

task :diff, [:base, :new] do |t, args|

  clean = system 'git diff --exit-code --quiet'
  if !clean
    puts "Your current checkout is dirty, please clean it up before running diff.".red
    next
  end

  #checkout and generate css for our base reference
  puts "Checking out #{args[:base]}".cyan.bold
  sh "git checkout #{args[:base]}"

  puts "Cleaning...".blue
  Rake::Task['clean'].execute

  puts "Generating #{args[:base]} css/html".blue
  Rake::Task['css'].execute

  Rake::Task['generate_images'].execute :out_dir => 'base'

  puts "Checking out #{args[:base]}".cyan.bold


  #checkout and generate css for our changes
  puts "Checking out #{args[:new]}".cyan.bold
  sh "git checkout #{args[:new]}"

  puts "Cleaning...".blue
  Rake::Task['clean'].execute

  puts "Generating #{args[:new]} css/html".blue
  Rake::Task['css'].execute

  Rake::Task['generate_images'].execute :out_dir => 'new'

  #compare images
  Rake::Task['compare'].execute

  #are there changes?
  Rake::Task['generate_report'].execute :out_dir => args[:new], :new_label => args[:new], :base_label => args[:base]
end

task :all do
  puts "Cleaning project".blue.bold
  Rake::Task['clean'].execute

  puts "\nBuilding CSS".blue.bold
  Rake::Task['css'].execute

  puts "\nBuilding JS".blue.bold
  Rake::Task['js'].execute

  puts "\nBuilding Docs".blue.bold
  Rake::Task['doc'].execute

end

task :default => 'all'
