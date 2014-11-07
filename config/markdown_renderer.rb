class MarkdownRenderer < Hologram::MarkdownRenderer
  def table(heading, body)
    return '<table class="table tableBasic"><thead>' + heading + '</thead><tbody>' + body + '</tbody></table>'
  end

  def table_row(content)
    '<tr>' + content.gsub('<th>', '<th class="txtL">') + '</tr>'
  end

  def list(contents, list_type)
    if list_type.to_s.eql?("ordered")
      '<ol class="listOrdered">' + contents + '</ol>'
    else
      '<ul class="listBulleted">' + contents + '</ul>'
    end
  end
end
