package bdom.kikwit.web;

import bdom.kikwit.Dto.IndicateurTechniqueRequestDto;
import bdom.kikwit.Dto.IndicateurTechniqueResponseDto;
import bdom.kikwit.Services.IndicateurTechniqueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Indicateur technique", description = "Rapport technique de chaque structure de santé")
public class IndicateurTechniqueController {
    private IndicateurTechniqueService service;

   @PostMapping(path = "/indicateurs")
   @Operation(summary = "Insertion des indicateurs techniques")
    public IndicateurTechniqueResponseDto save(@RequestBody IndicateurTechniqueRequestDto requestDto){
        return service.save(requestDto);
    }
    @GetMapping(path = "/indicateurs")
    @Operation(summary = "Affiche la liste de tous les indicateurs")
    public List<IndicateurTechniqueResponseDto> list(){
       return  service.getAll();
    }
    @PatchMapping(path = "/indicateurs/{id}")
    @Operation(summary = "Modification d'un indicateur technique")
    public IndicateurTechniqueResponseDto update(@PathVariable Long id, @RequestBody IndicateurTechniqueRequestDto requestDto){
       return service.update(id,requestDto);
    }
    @DeleteMapping(path = "/indicateurs/{id}")
    @Operation(summary = "Supprimé un indicateur technique")
    public String delete(@PathVariable Long id){
        return service.delete(id);
    }
}
