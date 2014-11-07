# A few guard rules to help easy development
guard :shell do

  # Build things
  watch( %r{^components/.*\.(scss)$} ) { |m| system "make css; make doc" }
  watch( %r{^components/.*\.(js)$} ) { |m| system "make js; make doc" }
  watch( %r{^hologram_assets/.*$} ) { |m| system "make doc" }

end
